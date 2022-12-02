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

  updateTimeline(userName, timelineData) {
    if (this.following.has(userName)) {
      this.following.set(userName, timelineData);
      return true;
    }
    return false
  }

  getMergedTimeline() {
    const mergedTimeline = this.timeline.map((elem) => { return {
      ...elem,
      userName: this.userName
    }});
    this.following.forEach((v, k) => {
      mergedTimeline.push(...v.map(elem => { return {
        ...elem,
        userName: k
      }}))
    })
    mergedTimeline.sort((a, b) => a.timestamp - b.timestamp);
    return mergedTimeline;
  }

  static async createTimeline(configs) {
    try {
      //const data = await fs.readFile(configs.dataPath, 'utf-8');
      throw new Error('TODO: read from file');
    } catch (e) {
      return new TimelineModel(configs.userName);
    }
  }
}
