// @flow
import bunyan from 'bunyan';

const { env: { BOT_LOGFILE_PATH } } = process;

const logger = {
  trace: () => {},
  debug: () => {},
  info: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
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
