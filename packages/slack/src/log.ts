import { Environment } from '@friends-library/types';
import { send, sendJson } from './send';

function log(msg: string, data?: Record<string, any>, channel?: string): void {
  sendAndLog({ msg, data, channel });
}

log.env = `production` as Environment;

log.setEnv = function(env: Environment): void {
  log.env = env;
};

log.error = function error(msg: string, data?: Record<string, any>): void {
  sendAndLog({ msg, data, emoji: `:fire_engine:`, channel: `errors` });
};

log.info = function info(msg: string, data?: Record<string, any>): void {
  sendAndLog({ msg, data, channel: `info` });
};

log.order = function order(msg: string, data?: Record<string, any>): void {
  sendAndLog({ msg, data, channel: `orders`, emoji: `:books:` });
};

log.download = function download(msg: string, data?: Record<string, any>): void {
  sendAndLog({ msg, data, channel: `downloads` });
};

log.debug = function debug(msg: string, data?: Record<string, any>): void {
  sendAndLog({ msg, data, channel: `debug` });
};

interface SlackData {
  msg: string;
  data?: Record<string, any>;
  channel?: string;
  emoji?: string;
}

function sendAndLog({ msg, data, channel: prodChannel, emoji }: SlackData): void {
  if (!shouldLog()) return;
  const logMethod: 'error' | 'log' = prodChannel === `errors` ? `error` : `log`;

  let channel = prodChannel || `debug`;
  if (log.env !== `production`) {
    channel = `staging`;
  }

  try {
    if (data) {
      sendJson(msg, data, channel, emoji);
      console[logMethod](msg, channel, data);
      return;
    }

    send(msg, channel, emoji);
    console[logMethod](msg, channel);
  } catch (error) {
    console.error(`Error sending slack`, { error, msg, channel, emoji, data });
  }
}

function shouldLog(): boolean {
  if (typeof process.env.JEST_WORKER_ID !== `undefined`) {
    return false;
  }
  return process.env.NODE_ENV === undefined || process.env.NODE_ENV === `production`;
}

export default log;
