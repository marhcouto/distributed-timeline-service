import timestamp from 'unix-timestamp';
import jose from 'node-jose';
import { buildSignedMessage, extractSignedMessage, buildMessageWithKey } from '../auth.mjs';

timestamp.round = true;

export class TimelineModel {
  constructor(userName, keystore) {
    this.userName = userName;
    this.keystore = keystore;
    this.following = new Map();
    this.timeline = [];
  }

  async followUser(userName, activityArray, key) {
    if (typeof userName !== 'string') {
      throw new Error("[TimelineModel] Tried to insert userName that wasn't a string");
    }
    await this.keystore.add(key);
    return this.following.set(userName, activityArray);
  }

  unfollowUser(userName) {
    return this.following.delete(userName);
  }

  getTimelineForUser(userName) {
    if (userName === this.userName) {
      return this.timeline;
    }
    return this.following.get(userName);
  }

  async getTimelineForUserWithKey(userName) {
    let timeline;
    if (userName === this.userName) {
      timeline = this.timeline;
    } else {
      timeline = this.following.get(userName);
    }
    return await buildMessageWithKey(userName, this.keystore, timeline);
  }

  async publishMessage(messageBody) {
    const message = {
      message: messageBody,
      timestamp: timestamp.now()
    };
    const signedMessage = await buildSignedMessage(this.userName, this.keystore, JSON.stringify(message));
    return this.timeline.push(signedMessage);
  }

  replaceTimeline(userName, timelineData) {
    if (this.following.has(userName)) {
      this.following.set(userName, timelineData);
      return true;
    }
    return false
  }

  async lastUpdated(userName) {
    let timeline = null;
    if (userName === this.userName) {
      timeline = this.timeline
    } else {
      timeline = this.following.get(userName);
    }

    if (timeline == null) {
      return null;
    }
    
    if (timeline.length === 0) {
      return 0;
    }
    const unwrappedLastPost = await extractSignedMessage(userName, this.keystore, timeline[timeline.length - 1]);

    return unwrappedLastPost.timestamp;
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
    const keystore = await jose.JWK.asKeyStore(timelineModelObj.keystore);
    const timelineModel = new TimelineModel(timelineModelObj.userName, 
      await jose.JWK.asKeyStore(timelineModelObj.keystore));
    timelineModel.timeline = timelineModelObj.timeline;
    for (const timeline of timelineModelObj.following) {
      timelineModel.following.set(timeline.userName, timeline.timeline);
    }
    return timelineModel;
  }
}
