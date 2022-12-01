import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

export class TimelineServer {
  constructor(configs, timelineModel) {
    this.timelineModel = timelineModel;
    const app = express();
    app.use(cors())
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }))

    app.get('/timeline/:id', this._getTimelineRequestHandler.bind(this));
    app.put('/timeline/:id', this._postTimelineRequestHandler.bind(this));

    app.listen(configs.timelineServerPort, () => {
      console.log(`[Timeline Server] Listening for requests at port ${configs.timelineServerPort}`);
    })
  }

  _getTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    const timeline = this.timelineModel.getTimelineForUser(userName);
    if (!timeline) {
      res.status(404).end();
      return;
    }

    res.writeHead(200, {
      'Content-Type': 'application/json'
    });
    res.write(JSON.stringify({name: "Francisco"}));
    res.end();
  }

  _postTimelineRequestHandler(req, res) {
    const userName = req.params.id;
    if (this.timelineModel.updateTimeline(userName, req.body)) {
      res.status(204).end();
    }
    res.status(404).end();
  }
}