import env from './env';
import * as slack from '@friends-library/slack';

function log(msg: string, data?: Record<string, any>): void {
  if (!shouldLog()) return;
  sendSlack(msg, data);
  console.log(msg, data);
}

log.error = error;

function error(msg: string, data?: Record<string, any>): void {
  if (!shouldLog()) return;
  sendSlack(msg, data, ':fire_engine:');
  console.error(msg, data);
}

function sendSlack(msg: string, data?: Record<string, any>, emoji?: string): void {
  const SLACK_FNS_LOGS_CHANNEL = env('SLACK_FNS_LOGS_CHANNEL');
  if (data) {
    slack.sendJson(msg, data, SLACK_FNS_LOGS_CHANNEL, emoji);
    return;
  }
  slack.send(msg, SLACK_FNS_LOGS_CHANNEL, emoji);
}

function shouldLog(): boolean {
  if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
    return false;
  }
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'production';
}

export default log;
