// @flow
import type { ProbotApplication } from './type';
import pullRequest from './pull-request';

const { env: { BOT_LOGFILE_PATH } } = process;

export default function (app: ProbotApplication): void {
  app.on('pull_request', bound(pullRequest));
}

function bound(fn) {
  return (context, ...rest) => {
    addLogStream(context.log);
    context.repo = context.repo.bind(context);
    context.issue = context.issue.bind(context);
    try {
      return fn(context, ...rest);
    } catch (e) {
      context.log.error(e);
      return false;
    }
  };
}

function addLogStream(logger) {
  if (!BOT_LOGFILE_PATH) {
    return;
  }

  const existingStreams = logger.target.streams;
  if (existingStreams.some(s => s.type === 'rotating-file')) {
    return;
  }

  logger.target.addStream({
    type: 'rotating-file',
    path: BOT_LOGFILE_PATH,
    period: '1d',
    count: 5,
    level: 'debug',
  });
}
