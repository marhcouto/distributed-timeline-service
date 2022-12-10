export class TimelinePropagatorController {
  constructor(app, logger, timelineService, timelineModel) {
    this.produceLog = (message) => {
      logger.log('TPC', message);
    }
    this._timelineService = timelineService;
    this._timelineModel = timelineModel;

    app.get('/timeline/:id', this._getTimelineRequestHandler.bind(this));
    app.put('/timeline/:id', this._postTimelineRequestHandler.bind(this));
    app.get('/timeline/last-update/:id', this._getTimelineLastUpdateHandler.bind(this));
    app.get('/timeline/:id/key', this._getTimelinePublicKey.bind(this));
  }

  async _getTimelineLastUpdateHandler(req, res) {
    const userName = req.params.id;
    this.produceLog(`GET | Last update: ${userName}`);
    const timelineLastUpdate = await this._timelineModel.lastUpdated(userName);
    if (timelineLastUpdate == null) {
      res.status(404).end();
      return;
    }
    res.status(200).send(JSON.stringify({lastUpdated: timelineLastUpdate}));
  }

  async _getTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    const unsigned = req.query.unsigned;
    this.produceLog(`GET | Timeline: ${userName}`);
    const timeline = unsigned ? 
      await this._timelineService._timelineModel.getTimelineForUser(userName) :
      await this._timelineService._timelineModel.getSignedTimelineForUser(userName);
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

  async _postTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    this.produceLog(`POST | Timeline: ${userName}`);

    if (await this._timelineService.replaceTimeline(userName, req.body)) {
      this.produceLog(`POST | Received updated timeline for ${userName}`);
      res.status(204).end();
    }
    this.produceLog(`POST | Received updated timeline for ${userName} but was rejected`);
    res.status(403).end();
  }

  async _getTimelinePublicKey(req, res) {
    const userName = req.params.id;
    const timelineKey = await this._timelineService.getPublicKey(userName);
    if (timelineKey) {
      res.status(200).send(timelineKey.toJSON()).end();
    }
    res.status(404).end();
  }
}