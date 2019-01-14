// @flow

export type Dispatch = (any) => *;

export type GitHub = {|
  token: string,
|};

export type State = {|
  github: GitHub,
  screen: string,
  // currentTask: Uuid,
  // tasks: { [string]: Task },
  // friends: { [Slug]: Friend },
  // repos: { [string]: Repo },
  // editingFile: EditingFile,
  // search: Search,
|};
