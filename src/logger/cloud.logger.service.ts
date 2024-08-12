import { Injectable, LoggerService } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
@Injectable()
export class CloudLogger implements LoggerService {
  data: any = {};
  init(req) {
    this.data['reqId'] = req.headers['request-id'] || uuidv4();
    this.data['requestSource'] = req.headers['request-source'];
    this.data['country'] = req.headers['country'];
    this.data['appversion'] = req.headers['x-app-version'];
    this.data['deviceId'] = req.headers['x-device-id'];
  }

  setAttr(obj?: any) {
    Object.keys(obj).forEach((key) => {
      this.data[key] = JSON.stringify(obj[key]);
    });
  }

  log(message?: any, obj: any = {}) {
    const options = { ...obj };
    Object.keys(options).forEach((key) => {
      options[key] = JSON.stringify(options[key]);
    });

    return console.log({
      message: JSON.stringify(message),
      logLevel: 'log',
      ...this.data,
      ...options,
    });
  }

  error(message?: any, error?: any, obj: any = {}) {
    const options = { ...obj };
    Object.keys(options).forEach((key) => {
      options[key] = JSON.stringify(options[key]);
    });

    try {
      options['stackTrace'] = error.stack;
      options['errorMessage'] = error.message;
      options['errorName'] = error.name;
    } catch (e) {
      options['stackTrace'] = "Could't get stack trace";
      options['errorMessage'] = "Could't get error message";
      options['errorName'] = "Could't get error name";
    }

    return console.log({
      message: JSON.stringify(message),
      logLevel: 'error',
      ...options,
      ...this.data,
    });
  }

  warn(message: any, options: any) {
    return console.log({
      message: JSON.stringify(message),
      logLevel: 'warn',
      ...options,
      ...this.data,
    });
  }
}
