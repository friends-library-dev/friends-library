function log(...args: any[]): void {
  shouldLog() && console.log(...args);
}

log.error = error;

function error(...args: any[]): void {
  shouldLog() && console.error(...args);
}

function shouldLog(): boolean {
  if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
    return false;
  }
  return process.env.NODE_ENV === 'production';
}

export default log;
