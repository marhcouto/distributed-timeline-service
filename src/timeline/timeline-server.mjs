import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fsp from 'fs/promises';
import fs from 'fs'
import { TimelineClientController } from './timeline-client-controller.mjs';
import { TimelinePropagatorController } from './timeline-propagator-controller.mjs';
import { log } from '../utils/logging.mjs';

export const startTimelineServer = (configs, timelineService) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));

  new TimelinePropagatorController(app, timelineService);
  new TimelineClientController(app, timelineService);

  app.listen(configs.timelineServerPort, () => {
    log('TS', `Listening for requests at port ${configs.timelineServerPort}`)
  })
}
