// @flow
import type { ProbotApplication } from './type'
import pullRequest from './pull-request';

export default function(app: ProbotApplication): void {
  app.on('pull_request', pullRequest);
}
