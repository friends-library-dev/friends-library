// @flow
import Octokit from '@octokit/rest';
import pullRequest from './pull-request';

export type Context = {|
  payload: Object,
  github: Octokit,
  event: string,
  repo: ({ [string]: mixed }) => {
    owner: string,
    repo: string,
    [string]: mixed,
  },
  issue: ({ [string]: mixed }) => {
    owner: string,
    repo: string,
    number: number,
    [string]: mixed,
  },
|};

type Application = {|
  on: (string, (Context) => mixed) => void,
|};

export default function(app: Application): void {
  app.on('pull_request', pullRequest);
}
