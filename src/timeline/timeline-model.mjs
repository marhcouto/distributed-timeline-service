import timestamp from 'unix-timestamp';
import { buildSignedTimeline, extractSignedTimeline } from '../auth.mjs';
import jose from 'node-jose';

timestamp.round = true;

export class TimelineModel {
  constructor(userName, keystore) {
    this.userName = userName;
    this.keystore = keystore;
    this.following = new Map();
    this.timeline = [];
  }

  async followUser(userName, signedTimeline, key) {
    if (typeof userName !== 'string') {
      throw new Error("[TimelineModel] Tried to insert userName that wasn't a string");
    }
    await this.keystore.add(key);
    return this.following.set(userName, signedTimeline);
  }

  unfollowUser(userName) {
    return this.following.delete(userName);
  }

  async getTimelineForUser(userName) {
    if (userName === this.userName) {
      return this.timeline;
    } else {
      return await extractSignedTimeline(userName, this.keystore, this.following.get(userName));
    }
  }

  async publishMessage(messageBody) {
    const message = {
      message: messageBody,
      timestamp: timestamp.now()
    };
    return this.timeline.push(message);
  }

  async getSignedTimelineForUser(userName) {
    if (userName === this.userName) {
      return await buildSignedTimeline(userName, this.keystore, this.timeline);
    }
    return this.following.get(userName);
  }

  replaceTimeline(userName, timelineData) {
    if (this.following.has(userName)) {
      this.following.set(userName, timelineData);
      return true;
    }
    return false;
  }

  async lastUpdated(userName) {
    let timeline = await this.getTimelineForUser(userName);
    if (timeline == null) {
      return null;
    }
    
    if (timeline.length === 0) {
      return 0;
    }

    return timeline[timeline.length - 1].timestamp;
  }

  toJSON() {
    const timelineModelObj = {}
    timelineModelObj.userName = this.userName;
    timelineModelObj.timeline = this.timeline;
    timelineModelObj.keystore = this.keystore.toJSON(true);
    timelineModelObj.following = []
    for (const [key, value] of this.following.entries()) {
      timelineModelObj.following.push({
        userName: key,
        timeline: value 
      })
    }

    return JSON.stringify(timelineModelObj);
  }

  static async fromJSON(jsonStr) {
    const timelineModelObj = JSON.parse(jsonStr);
    const timelineModel = new TimelineModel(
      timelineModelObj.userName, 
      await jose.JWK.asKeyStore(timelineModelObj.keystore)
    );
    timelineModel.timeline = timelineModelObj.timeline;
    for (const timeline of timelineModelObj.following) {
      timelineModel.following.set(timeline.userName, timeline.timeline);
    }
    return timelineModel;
  }
}
