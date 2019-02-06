// @flow

export type Repo = string;

export type Repos = Array<Repo>;

export type Argv = {|
  scope: string | void,
  exclude: Array<string>,
|};
