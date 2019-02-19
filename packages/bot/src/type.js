// @flow
import Octokit from '@octokit/rest';
import type { Asciidoc, FilePath } from '../../../type';

export type ModifiedAsciidocFile = {|
  path: FilePath,
  adoc: Asciidoc,
|};

export type Context = {|
  payload: Object,
  github: Octokit,
  event: string,
  repo: <T>(object?: T) => T,
  issue: <T>(object?: T) => T,
|};

export type ProbotApplication = {|
  on: (string, (Context) => mixed) => void,
|};
