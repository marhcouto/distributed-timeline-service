import timestamp from 'unix-timestamp';

timestamp.round = true

export class TimelineItem {
  constuctor(message) {
    this.message = message;
    this.timestamp = timestamp.now();
  }
}