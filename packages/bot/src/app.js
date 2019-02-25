// @flow
import type { ProbotApplication } from './type';
import pullRequest from './pull-request';
import { proxyLog } from './log';

export default function (app: ProbotApplication): void {
  proxyLog(app.log);
  app.on('pull_request', bound(pullRequest));
}

function bound(fn) {
  return (context, ...rest) => {
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
