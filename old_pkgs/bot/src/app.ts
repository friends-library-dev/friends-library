import { ApplicationFunction, Context } from 'probot';
import pullRequest from './pull-request';
import { proxyLog } from './log';

const appFn: ApplicationFunction = function(app) {
  proxyLog(app.log);
  app.on('pull_request', bound(pullRequest));
};

export default appFn;

function bound(
  fn: (context: Context) => Promise<void>,
): (context: Context) => Promise<void> {
  return async context => {
    context.repo = context.repo.bind(context);
    context.issue = context.issue.bind(context);
    try {
      return await fn(context);
    } catch (e) {
      context.log.error(e);
      return Promise.resolve(void 0);
    }
  };
}
