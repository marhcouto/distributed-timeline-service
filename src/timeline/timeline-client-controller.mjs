export class TimelineClientController {
  constructor(app, logger, timelineService, timelineModel) {
    this._timelineService = timelineService;
    this._timelineModel = timelineModel;
    this.produceLog = (message) => {
      logger.log('TCC', message);
    }

    app.get('/api/identity', this._getIdentity.bind(this));
    app.post('/api/following/:id', this._followUser.bind(this));
    app.post('/api/timeline', this._postNewMessage.bind(this));
    app.delete('/api/following/:id', this._unfollowUser.bind(this));
    app.get('/api/timeline', this._getTimeline.bind(this));
    app.get('/api/timeline/sync', this._syncTimeline.bind(this));
    app.get('/api/timeline/:id', this._getTimelineForUser.bind(this));
  }

  _getIdentity(_, rep) {
    rep.status(200).json({id: this._timelineService._timelineModel.userName});
  }

  async _getTimelineForUser(req, rep) {
    const userName = req.params.id;
    try {
      const remoteTimeline = await this._timelineService.getTimelineForRemoteUser(userName);
      rep.status(200).json(remoteTimeline).end();
    } catch(e) {
      console.error(e);
      rep.status(404).end();
    }
  }

  async _syncTimeline(_, rep) {
    await this._timelineService.syncTimeline();
    rep.status(204).end();
  }

  async _getUserFeed(_, rep) {
    this.produceLog('GET | Timeline');
    const response = await this._timelineService.getUserFeed(); 
    rep.status(200).send(response);
  }

  _postNewMessage(req, rep) {
    const body = req.body;
    this.produceLog(`POST | Message: ${JSON.stringify(body.message)}`);
    this._timelineService.postNewMessage(body.message);
    rep.status(204).end();
  }

  _unfollowUser(req, rep) {
    const userName = req.params.id;
    this.produceLog(`DELETE | Follow: ${userName}`);
    if (!this._timelineService.unfollowUser(userName)) {
      rep.status(404).end();
      return;
    }
    rep.status(204).end();
  }

  _followUser(req, rep) {
    const userName = req.params.id;
    this.produceLog(`POST | Follow: ${userName}`);
    this._timelineService.followUser(userName)
      .then((_) => rep.status(204).end())
      .catch((_) => rep.status(404).end());
  }
}
