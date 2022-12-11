import fs from 'fs';
import yargs from 'yargs';
import { isIPv4 } from 'net';
import { hideBin } from 'yargs/helpers';
import { startTimelineServer } from './timeline/timeline-server.mjs';
import { createTimeline, saveTimeline, saveTimelineSync } from './timeline/timeline-fs.mjs';
import { Logger } from './utils/logging.mjs';
import { createKeyPair } from './auth.mjs';

const validArguments = ['peerFinderPort', 'timelineServerPort', 'bootstrapNodes', 'dataPath', 'userName', 'logPath'];

const isValidIpV4WithPort = (ipString) => {
  const ipParts = ipString.split(':')
  if (ipParts.length !== 2) {
    throw new Error('IP given is not a valid IPv4');
  }
  if (!isIPv4(ipParts[0])) {
    throw new Error('IP given is not a valid IPv4');
  }
  if (isNaN(ipParts[1])) {
    throw new Error('IP given has invalid port');
  }
  if (ipParts[1] <= 0 || ipParts[1] > 65535) {
    throw new Error('IP given has a port out of range: [1, 65535]');
  }

  return ipString
}

const isValidPort = (portString) => {
  if (portString <= 0 || portString > 65535) {
    throw new Error('IP given has a port out of range: [1, 65535]');
  }
  return Number.parseInt(portString);
}

const parseConfigFile = (configPath) => {
  const configs = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  for (let config in configs) {
    if (!validArguments.includes(config)) {
      throw new Error(`Unexpected property '${config}'. Property must be one of '${validArguments}'`)
    }
  }

  if (configs.dhtServerIp) {
    configs.dhtServerIp = isValidPort(configs.dhtServerIp);
  }
  if (configs.timelineServerIp) {
    configs.timelineServerIp = isValidPort(configs.timelineServerIp);
  }
  if (configs.bootstrapNodes) {
    configs.bootstrapNodes = configs.bootstrapNodes.map(isValidIpV4WithPort);
  }

  return configs
}

const main = async () => {
  const argv = yargs(hideBin(process.argv))
    .options({
      'disable-logs': {
        describe: 'If present disables saving logs into a log file',
        default: false,
        type: 'boolean'
      },
      'disable-backups': {
        describe: "If present the state of the server isn't saved to disk when it's turned off",
        default: false,
        type: 'boolean'
      }
    })
    .config('config-file', 'Path to a JSON configuration file', parseConfigFile)
    .demandOption('config-file')
    .help()
    .alias('help', 'h').argv;

  const configs = Object.keys(argv)
    .filter(key => validArguments.includes(key))
    .reduce((obj, key) => {
      obj[key] = argv[key];
      return obj;
    }, {});
  if (!configs.dataPath) {
    configs.dataPath = `data/${configs.userName}.json`;
  }
  if (!configs.logPath) {
    configs.logPath = `logs/${configs.userName}.log`
  }
  configs.disableLogs = argv.disableLogs;
  configs.disableBackups = argv.disableBackups;
  
  const logger = await Logger.createLogger(configs);
  const [timelineService, timelineModel] = await createTimeline(configs, logger);

  const backupJob = async () => {
    await saveTimeline(configs, timelineService._timelineModel, timelineService.dhtJSON());
    setTimeout(() => {
      backupJob()
    }, 5000);
  }
  if (!configs.disableBackups) {
    logger.saveToFile = true;
    backupJob()
  }
  process.on('SIGINT', () => {
    if (!configs.disableBackups) {
      saveTimelineSync(configs, timelineService._timelineModel, timelineService.dhtJSON());
    }
    process.exit()
  })

  startTimelineServer(configs, logger, timelineService, timelineModel);
}

main()
