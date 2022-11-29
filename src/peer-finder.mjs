import DHT from 'bittorrent-dht';
import crypto from 'crypto';

export default class PeerFinder {
  hashVersion = 'sha1';
  digestType = 'hex';

  constructor(configs, onPeerFound, onLookupFinished) {
    this.timelineServerPort = configs.timelineServerPort;
    this._onLookupFinished = onLookupFinished;

    this._dht = new DHT({
      bootstrap: configs.bootstrapNodes
    });

    const dhtPort = configs.peerFinderPort ? configs.peerFinderPort : 8000;
    this._dht.listen(
      dhtPort,
      () => console.log(`[PEER] Started listening for DHT events on port '${dhtPort}'`)
    );

    this._dht.on('peer', onPeerFound);

    this._dht.on('node', (node) => 
      console.log(`[PEER] Received node: ${node}`)
    );
    this._dht.on('announce', (peer, infoHash) =>
      console.log(`[PEER] Received announce for '${infoHash}' by ${peer}`)
    );
    this._dht.on('warning', (err) =>
      console.log(`[PEER] Received warning: ${err}`)
    );
  }

  _hash(str) {
    return crypto.createHash(this.hashVersion).update(str).digest(this.digestType)
  }

  announce(userTag) {
    this._dht.announce(this._hash(userTag), this.timelineServerPort); 
  }

  lookup(userTag) {
    this._dht.lookup(this._hash(userTag), this._onLookupFinished);
  }
}