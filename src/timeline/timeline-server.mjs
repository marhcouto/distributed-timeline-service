import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { TimelineClientController } from './timeline-client-controller.mjs';
import { TimelinePropagatorController } from './timeline-propagator-controller.mjs';

export const startTimelineServer = (configs, logger, timelineService) => {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static('public/'));

  new TimelinePropagatorController(app, logger, timelineService);
  new TimelineClientController(app, logger, timelineService);

  app.listen(configs.timelineServerPort, () => {
    logger.log('TS', `Listening for requests at port ${configs.timelineServerPort}`)
  })
}
