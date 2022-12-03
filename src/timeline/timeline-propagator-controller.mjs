import { log } from '../utils/logging.mjs';

export class TimelinePropagatorController {
  constructor(app, timelineService) {
    this.produceLog = (message) => {
      log('TPC', message);
    }
    this._timelineService = timelineService;

    app.get('/timeline/:id', this._getTimelineRequestHandler.bind(this));
    app.put('/timeline/:id', this._postTimelineRequestHandler.bind(this));
    app.get('/timeline/last-update/:id', this._getTimelineLastUpdateHandler.bind(this));
  }

  _getTimelineLastUpdateHandler(req, res) {
    const userName = req.params.id;
    const timelineLastUpdate = this._timelineService.timelineLastUpdate(userName);
    if (timelineLastUpdate == null) {
      res.status(404).end();
      return;
    }
    res.status(200).send(JSON.stringify({lastUpdated: timelineLastUpdate}));
  }

  _getTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    const timeline = this._timelineService.getTimelineForUser(userName);
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

    if (this._timelineService.replaceTimeline(userName, req.body)) {
      this.produceLog(`POST | Received updated timeline for ${userName}`);
      res.status(204).end();
    }
    this.produceLog(`POST | Received updated timeline for ${userName} but it's not followed by me`);
    res.status(403).end();
  }
}