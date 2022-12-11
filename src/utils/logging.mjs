import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';

export class Logger {
  constructor(saveLogs, logFilePath) {
    this.saveLogs = saveLogs;
    this.logFilePath = logFilePath;
  }

  static async _clearGarbageAndSetup(configs) {
    if (!fs.existsSync(path.dirname(configs.logPath))) {
      await fs.mkdirSync(path.dirname(configs.logPath));
    }
    if (fs.existsSync(configs.logPath)) {
      await fsp.truncate(configs.logPath);
    }
  }

  static async createLogger(configs) {
    if (!configs.disableLogs) {
      await this._clearGarbageAndSetup(configs); 
    }
    return new Logger(!configs.disableLogs, configs.logPath);
  }

  log(module, message) {
    const logMessage = `${new Date().toISOString()} | ${module} | ${message}`;
    console.log(logMessage);
    if (this.saveLogs) {
      fs.appendFileSync(this.logFilePath, `${logMessage}\n`);
    }
  }
}
