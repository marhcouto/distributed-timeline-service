import fs from 'fs';
import yargs from 'yargs';
import { isIPv4 } from 'net';
import { hideBin } from 'yargs/helpers';
import { TimelineModel } from './timeline/TimelineModel.mjs';
import { TimelineServer } from './timeline/TimelineServer.mjs';

const validArguments = ['peerFinderPort', 'timelineServerPort', 'bootstrapNodes', 'dataPath', 'userName'];

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
    configs.dataPath = 'data.json';
  }

  new TimelineServer(configs, await TimelineModel.createTimeline(configs));
}

main()
