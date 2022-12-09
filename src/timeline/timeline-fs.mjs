import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { createKeyPair } from '../auth.mjs';
import { TimelineModel } from './timeline-model.mjs';
import { TimelineService } from './timeline-service.mjs';

export const saveTimelineSync = (configs, timelineModel) => {
  if (!fs.existsSync(path.dirname(configs.dataPath))) {
    fs.mkdirSync(path.dirname(configs.dataPath));
  }
  fs.writeFileSync(configs.dataPath, timelineModel.toJSON())
}

export const saveTimeline = async (configs, timelineModel) => {
  if (!fs.existsSync(path.dirname(configs.dataPath))) {
    await fsp.mkdir(path.dirname(configs.dataPath));
  }
  return fsp.writeFile(configs.dataPath, timelineModel.toJSON())
}

export const createTimeline = async (configs, logger) => {
  try {
    const data = await fsp.readFile(configs.dataPath);
    const timelineModel = await TimelineModel.fromJSON(data);
    const timelineService = new TimelineService(configs, logger, timelineModel);
    await timelineService.syncTimeline(); 
    return timelineService;
  } catch (exception) {
    const keystore = await createKeyPair(configs.userName);
    return new TimelineService(configs, logger, new TimelineModel(configs.userName, keystore));
  }
}