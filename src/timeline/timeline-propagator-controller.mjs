import { log } from '../utils/logging.mjs';

export class TimelinePropagatorController {
  constructor(app, timelineModel) {
    this.produceLog = (message) => {
      log('TPC', message);
    }
    this._timelineModel = timelineModel;

    app.get('/timeline/:id', this._getTimelineRequestHandler.bind(this));
    app.put('/timeline/:id', this._postTimelineRequestHandler.bind(this));
  }

  _getTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    const timeline = this._timelineModel.getTimelineForUser(userName);
    if (!timeline) {
      this.produceLog(`GET | Can't find timeline for ${userName}`);
      res.status(404).end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(timeline));
    res.end();
    this.produceLog(`GET | Timeline sent for ${userName}`);
  }

  _postTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    if (userName === this._timelineModel.userName) {
      res.status(403).end();
      return;
    }

    if (this._timelineModel.updateTimeline(userName, req.body)) {
      this.produceLog(`POST | Received updated timeline for ${userName}`);
      res.status(204).end();
    }
    this.produceLog(`POST | Received updated timeline for ${userName} but it's not followed by me`);
    res.status(404).end();
  }
}