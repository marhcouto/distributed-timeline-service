import { log } from './utils/logging.mjs';
import DHT from 'bittorrent-dht';
import crypto from 'crypto';

const MAX_PEER_AGE = 30000;
const REFRESH_TIME = 0.75 * MAX_PEER_AGE; 

export class PeerFinder {
  hashVersion = 'sha1';
  digestType = 'hex';

  constructor(configs, onPeerFound) {
    this.timelineServerPort = configs.timelineServerPort;

    this.produceLog = (message) => {
      log('DHT', message);
    }

    this._dht = new DHT({
      bootstrap: configs.bootstrapNodes,
      maxAge: MAX_PEER_AGE,
    });

    const dhtPort = configs.peerFinderPort ? configs.peerFinderPort : 8000;
    this._dht.listen(
      dhtPort,
      () => this.produceLog(`Started listening for DHT events on port '${dhtPort}'`)
    );

    this._isAlone = true;

    this._dht.on('peer', (peer, infoHash, from) => {
      this.produceLog(`Found peer ${peer.host}:${peer.port} for infoHash '${infoHash.toString('hex')}'`);
      onPeerFound(peer, infoHash, from);
    });

    this._dht.on('node', (node) => {
      this.produceLog(`Found node: ${node.host}:${node.port}`);
      if (this._isAlone) {
        this.announce(configs.userName, configs.timelineServerPort);
        this._isAlone = false;
      }
    });

    this._dht.on('announce', (peer, infoHash) =>
      this.produceLog(`Received announce for '${infoHash.toString('hex')}' by ${peer.host}:${peer.port}`)
    );

    this._dht.on('warning', (err) =>
      this.produceLog(`Received warning: ${err}`)
    );
  }

  hash(str) {
    return crypto.createHash(this.hashVersion).update(str).digest(this.digestType)
  }

  announce(userTag) {
    this.produceLog(`Announced '${userTag}'`);
    setTimeout(() => {
      this.announce(userTag);
    }, REFRESH_TIME);
    return this._dht.announce(this.hash(userTag), this.timelineServerPort);
  }

  lookup(userTag, onLookupFinishedCallback) {
    return this._dht.lookup(this.hash(userTag), onLookupFinishedCallback);
  }
}