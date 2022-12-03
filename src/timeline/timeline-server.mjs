import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { TimelineClientController } from './timeline-client-controller.mjs';
import { TimelinePropagatorController } from './timeline-propagator-controller.mjs';
import { log } from '../utils/logging.mjs';

export const startTimelineServer = (configs, timelineModel) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  new TimelinePropagatorController(app, timelineModel);
  new TimelineClientController(configs, app, timelineModel);

  app.listen(configs.timelineServerPort, () => {
    log('TS', `Listening for requests at port ${configs.timelineServerPort}`)
  })
}
