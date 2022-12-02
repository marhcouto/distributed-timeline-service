export class TimelinePropagatorController {
  constructor(app, timelineModel) {
    this.timelineModel = timelineModel;

    app.get('/timeline/:id', this._getTimelineRequestHandler.bind(this));
    app.put('/timeline/:id', this._postTimelineRequestHandler.bind(this));
  }

  _getTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    const timeline = this.timelineModel.getTimelineForUser(userName);
    if (!timeline) {
      console.log(`[TPC] GET: Can't find timeline for ${userName}`);
      res.status(404).end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify(timeline));
    res.end();
    console.log(`[TPC] GET: Timeline sent for ${userName}`);
  }

  _postTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    if (this.timelineModel.updateTimeline(userName, req.body)) {
      console.log(`[TPC] POST: Received updated timeline for ${userName}`);
      res.status(204).end();
    }
    console.log(`[TPC] POST: Received updated timeline for ${userName} but it's not followed by me`);
    res.status(404).end();
  }
}