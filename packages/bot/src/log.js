// @flow
/* eslint-disable no-unused-vars */
/* istanbul ignore file */
import bunyan from 'bunyan';

const { env: { BOT_LOGFILE_PATH } } = process;

const logger = {
  trace: (dataOrMsg: string | Object, msg?: string) => {},
  debug: (dataOrMsg: string | Object, msg?: string) => {},
  info: (dataOrMsg: string | Object, msg?: string) => {},
  warn: (dataOrMsg: string | Object, msg?: string) => {},
  error: (dataOrMsg: string | Object, msg?: string) => {},
  fatal: (dataOrMsg: string | Object, msg?: string) => {},
};

export default logger;

export function proxyLog(log: any): void {
  ['trace', 'debug', 'info', 'warn', 'error', 'fatal'].forEach(level => {
    logger[level] = log[level].bind(log);
  });

  if (BOT_LOGFILE_PATH) {
    log.target.addStream({
      path: BOT_LOGFILE_PATH,
      type: 'rotating-file',
      period: '1d',
      count: 5,
      level: bunyan.DEBUG,
    });
  }
}
