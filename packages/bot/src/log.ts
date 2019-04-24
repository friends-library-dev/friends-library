import bunyan from 'bunyan';

const {
  env: { BOT_LOGFILE_PATH },
} = process;

type LogLevels = 'trace' | 'debug' | 'info' | 'warn' | 'error' | 'fatal';

function noop(): void {}

const logger: {
  [k in LogLevels]: (dataOrMsg: string | Record<string, any>, msg?: string) => void
} = {
  trace: noop,
  debug: noop,
  info: noop,
  warn: noop,
  error: noop,
  fatal: noop,
};

export default logger;

export function proxyLog(log: any): void {
  const levels: LogLevels[] = ['trace', 'debug', 'info', 'warn', 'error', 'fatal'];
  levels.forEach(level => {
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
