import * as slack from '@friends-library/slack';
import env from './env';

function log(msg: string, data?: Record<string, any>, channel?: string): void {
  sendSlack({ msg, data, channel });
}

log.error = error;
log.debug = debug;
log.info = info;
log.download = download;
log.order = order;

function error(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, emoji: ':fire_engine:', channel: 'errors' });
}

function info(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'info' });
}

function order(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'orders', emoji: ':books:' });
}

function download(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'downloads' });
}

function debug(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'debug' });
}

interface Slack {
  msg: string;
  data?: Record<string, any>;
  channel?: string;
  emoji?: string;
}

function sendSlack({ msg, data, channel: prodChannel, emoji }: Slack): void {
  if (!shouldLog()) return;
  const logMethod: 'error' | 'log' = prodChannel === 'errors' ? 'error' : 'log';

  let channel = prodChannel || 'debug';
  if (env.getContext() === 'TEST') {
    channel = 'staging';
  }

  try {
    if (data) {
      slack.sendJson(msg, data, channel, emoji);
      console[logMethod](msg, channel, data);
      return;
    }

    slack.send(msg, channel, emoji);
    console[logMethod](msg, channel);
  } catch (error) {
    console.error('Error sending slack', { error, msg, channel, emoji, data });
  }
}

function shouldLog(): boolean {
  if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
    return false;
  }
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'production';
}

export default log;
