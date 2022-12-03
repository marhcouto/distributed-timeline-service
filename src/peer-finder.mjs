import DHT from 'bittorrent-dht';
import crypto from 'crypto';

const MAX_PEER_AGE = 30000;
const REFRESH_TIME = 0.75 * MAX_PEER_AGE; 

export default class PeerFinder {
  hashVersion = 'sha1';
  digestType = 'hex';

  constructor(configs, onPeerFound) {
    this.timelineServerPort = configs.timelineServerPort;

    this._dht = new DHT({
      bootstrap: configs.bootstrapNodes,
      maxAge: MAX_PEER_AGE,
    });

    const dhtPort = configs.peerFinderPort ? configs.peerFinderPort : 8000;
    this._dht.listen(
      dhtPort,
      () => console.log(`[PEER] Started listening for DHT events on port '${dhtPort}'`)
    );

    this._isAlone = true;

    this._dht.on('peer', onPeerFound);

    this._dht.on('node', (node) => {
      console.log(`[DHT] Found node: ${node.host}:${node.port}`)
      if (this._isAlone) {
        this._dht.announce(this.hash(configs.userName), configs.timelineServerPort);
        this._isAlone = false;
      }
    });

    this._dht.on('announce', (peer, infoHash) =>
      console.log(`[DHT] Received announce for '${infoHash.toString('hex')}' by ${peer.host}:${peer.port}`)
    );

    this._dht.on('warning', (err) =>
      console.log(`[DHT] Received warning: ${err}`)
    );
  }

  hash(str) {
    return crypto.createHash(this.hashVersion).update(str).digest(this.digestType)
  }

  announce(userTag) {
    this._dht.announce(this.hash(userTag), this.timelineServerPort); 
    setTimeout(() => {
      this.announce(userTag);
    }, REFRESH_TIME);
  }

  lookup(userTag, onLookupFinishedCallback) {
    return this._dht.lookup(this.hash(userTag), onLookupFinishedCallback);
  }
}