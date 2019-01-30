// @flow

export type Line = string;

export type LineContext = {|
  lines: Array<Line>,
  index: number,
|};

export type MatchLocation = {|
  start: number,
  end: number,
  match: string,
  replace: Array<string>,
  prompt: boolean,
|};

export type LineMutation = {|
  start: number,
  end: number,
  replace: string,
|};

export type MutationResolver = (Line, Array<MatchLocation>, LineContext) => Promise<Array<LineMutation>>;

export type Finder = (Line: string) => Array<MatchLocation>;
