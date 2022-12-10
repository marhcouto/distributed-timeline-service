import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { createKeyPair } from '../auth.mjs';
import { TimelineModel } from './timeline-model.mjs';
import { TimelineService } from './timeline-service.mjs';

export const saveTimelineSync = (configs, timelineModel, kademliaJSON) => {
  if (!fs.existsSync(path.dirname(configs.dataPath))) {
    fs.mkdirSync(path.dirname(configs.dataPath));
  }
  const timelineModelObject = timelineModel.toPOJSO();
  fs.writeFileSync(configs.dataPath, JSON.stringify({
    timelineModel: timelineModelObject,
    kademliaModel: kademliaJSON
  }));
}

export const saveTimeline = async (configs, timelineModel, kademliaJSON) => {
  if (!fs.existsSync(path.dirname(configs.dataPath))) {
    await fsp.mkdir(path.dirname(configs.dataPath));
  }
  const timelineModelObject = timelineModel.toPOJSO();
  return fsp.writeFile(configs.dataPath, JSON.stringify({
    timelineModel: timelineModelObject,
    kademliaModel: kademliaJSON
  }));
}

export const createTimeline = async (configs, logger) => {
  try {
    const data = JSON.parse(await fsp.readFile(configs.dataPath));
    const timelineModel = await TimelineModel.fromPOJSO(data.timelineModel);
    const timelineService = new TimelineService(configs, logger, timelineModel, data.kademliaModel.nodes);
    await timelineService.syncTimeline(); 
    return [timelineService, timelineModel];
  } catch (exception) {
    const keystore = await createKeyPair(configs.userName);
    const timelineModel = new TimelineModel(configs.userName, keystore);
    const timelineService = new TimelineService(configs, logger, timelineModel);  
    return [timelineService, timelineModel];
  }
}