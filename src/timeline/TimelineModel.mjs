import timestamp from 'unix-timestamp';

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
    throw new Error('Merge timeline for all following');
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
