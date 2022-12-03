import { log } from '../utils/logging.mjs';

export class TimelineClientController {
  constructor(app, timelineService) {
    this._timelineService = timelineService;
    this.produceLog = (message) => {
      log('TCC', message);
    }

    app.post('/api/following/:id', this._followUser.bind(this));
    app.post('/api/timeline', this._postNewMessage.bind(this));
    app.delete('/api/following/:id', this._unfollowUser.bind(this));
    app.get('/api/timeline', this._getTimeline.bind(this));
  }

  _getTimeline(_, rep) {
    rep.status(200).send(this._timelineService.getMergedTimeline());
  }

  _postNewMessage(req, rep) {
    const body = req.body;
    this._timelineService.postNewMessage(body.message);
    rep.status(204).end();
  }

  _unfollowUser(req, rep) {
    const userName = req.params.id;
    if (!this._timelineService.unfollowUser(userName)) {
      rep.status(404).end();
      return;
    }
    rep.status(204).end();
  }

  _followUser(req, rep) {
    const userName = req.params.id;

    this._timelineService.followUser(userName)
      .then((_) => rep.status(204).end())
      .catch((_) => rep.status(404).end());
  }
}
