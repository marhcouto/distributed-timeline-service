import PeerFinder from './peer-finder.mjs';
import TimelineItem from './timeline-item.mjs'

export class TimelineController {
  constructor(configs) {
    this._peerFinder = new PeerFinder(configs, console.log, console.log);
    this.selfTimeline = [];
    this.timelines = new Map();
  }

  follow(userTag) {
    this._peerFinder(userTag);
    throw new Error('TODO: Update timeline part')
  }

  sendMessage(message) {
    this.selfTimeline.push(new TimelineItem(message));
  }
}