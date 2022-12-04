export class TimelineClientController {
  constructor(app, logger, timelineService) {
    this._timelineService = timelineService;
    this.produceLog = (message) => {
      logger.log('TCC', message);
    }

    app.post('/api/following/:id', this._followUser.bind(this));
    app.post('/api/timeline', this._postNewMessage.bind(this));
    app.delete('/api/following/:id', this._unfollowUser.bind(this));
    app.get('/api/timeline', this._getTimeline.bind(this));
  }

  _getTimeline(_, rep) {
    this.produceLog('GET | Timeline');
    rep.status(200).send(this._timelineService.getMergedTimeline());
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
