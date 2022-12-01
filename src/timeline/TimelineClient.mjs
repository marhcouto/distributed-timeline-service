export class TimelineClient {
  constructor(configs, timelineModel) {
    this.peerDht = new PeerFinder(configs);
  }

  onPeerFound() {

  }

  onLookupFinished() {
    
  }
}