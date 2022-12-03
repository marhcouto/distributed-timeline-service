import timestamp from 'unix-timestamp';

timestamp.round = true;

export class TimelineModel {
  constructor(userName) {
    this.userName = userName;
    this.following = new Map();
    this.timeline = [];
  }

  followUser(userName, activityArray) {
    if (typeof userName !== 'string') {
      throw new Error("[TimelineModel] Tried to insert userName that wasn't a string");
    }

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

  publishMessage(messageBody) {
    return this.timeline.push({
      message: messageBody,
      timestamp: timestamp.now()
    })
  }

  replaceTimeline(userName, timelineData) {
    if (this.following.has(userName)) {
      this.following.set(userName, timelineData);
      return true;
    }
    return false
  }

  lastUpdated(userName) {
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

    return timeline[timeline.length - 1].timestamp;
  }

  toJSON() {
    const timelineModelObj = {}
    timelineModelObj.userName = this.userName;
    timelineModelObj.timeline = this.timeline;
    timelineModelObj.following = []
    for (const [key, value] of this.following.entries()) {
      timelineModelObj.following.push({
        userName: key,
        timeline: value 
      })
    }

    return JSON.stringify(timelineModelObj);
  }

  static fromJSON(jsonStr) {
    const timelineModelObj = JSON.parse(jsonStr);
    const timelineModel = new TimelineModel(timelineModelObj.userName);
    timelineModel.timeline = timelineModelObj.timeline;
    for (const timeline of timelineModelObj.following) {
      timelineModel.following.set(timeline.userName, timeline.timeline);
    }
    return timelineModel;
  }
}
