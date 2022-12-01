import express from 'express'

export class TimelineEventServer {
  constructor(configs) {
    const app = express();
    app.get('/timeline/:userName', this._handleTimelineGet.bind(this));
    app.listen(configs.timelineServerPort, () => 
      console.log(`[Timeline] Serving timeline service on port ${configs.timelineServerPort}`));
  }

  _handleTimelineGet(req, res) {
    
  }

}
