function log(...args: any[]): void {
  shouldLog() && console.log(...args);
}

log.error = error;

function error(...args: any[]): void {
  shouldLog() && console.error(...args);
}

function shouldLog(): boolean {
  return typeof process.env.JEST_WORKER_ID === 'undefined';
}

export default log;
