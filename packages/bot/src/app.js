// @flow
import Octokit from '@octokit/rest';
import pullRequest from './pull-request';

export type Context = {|
  payload: Object,
  github: Octokit,
  event: string,
  repo: <T>(object?: T) => T,
  issue: <T>(object?: T) => T,
|};

type Application = {|
  on: (string, (Context) => mixed) => void,
|};

export default function(app: Application): void {
  app.on('pull_request', pullRequest);
}
