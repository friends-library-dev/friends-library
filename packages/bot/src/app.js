// @flow
import type { ProbotApplication } from './type'
import pullRequest from './pull-request';

export default function(app: ProbotApplication): void {
  app.on('pull_request', bound(pullRequest));
}

function bound(fn) {
  return function(context, ...rest) {
    context.repo = context.repo.bind(context);
    context.issue = context.issue.bind(context);
    return fn(context, ...rest);
  }
}
