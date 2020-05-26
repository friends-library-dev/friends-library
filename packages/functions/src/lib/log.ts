import * as slack from '@friends-library/slack';
import env from './env';

function log(msg: string, data?: Record<string, any>, channel?: string): void {
  sendSlack({ msg, data, channel });
  console.log(msg, data);
}

log.error = error;
log.debug = debug;
log.info = info;
log.download = download;
log.order = order;

function error(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, emoji: ':fire_engine:', channel: 'errors' });
  console.error(msg, data);
}

function info(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'info' });
  console.log(msg, data);
}

function order(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'orders', emoji: ':books:' });
  console.log(msg, data);
}

function download(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'downloads' });
  console.log(msg, data);
}

function debug(msg: string, data?: Record<string, any>): void {
  sendSlack({ msg, data, channel: 'debug' });
  console.log(msg, data);
}

interface Slack {
  msg: string;
  data?: Record<string, any>;
  channel?: string;
  emoji?: string;
}

function sendSlack({ msg, data, channel: prodChannel, emoji }: Slack): void {
  if (!shouldLog()) return;

  let channel = prodChannel || 'debug';
  if (env.getContext() === 'TEST') {
    channel = 'staging';
  }

  if (data) {
    slack.sendJson(msg, data, channel, emoji);
    return;
  }

  slack.send(msg, channel, emoji);
}

function shouldLog(): boolean {
  if (typeof process.env.JEST_WORKER_ID !== 'undefined') {
    return false;
  }
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === 'production';
}

export default log;
