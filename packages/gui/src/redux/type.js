// @flow

export type File = {|
  filename: string,
  path: string,
  content?: string,
|};

export type Files = {
  [string]: File,
};

export type Edition = {|
  type: string,
  files: Files,
|};

export type Editions = {
  [string]: Edition,
};

export type Document = {|
  slug: string,
  title: string,
  editions: Editions,
|};

export type Documents = {|
  [string]: Document,
|};

export type Friend = {|
  filesReceived: boolean,
  documents: Documents,
  slug: string,
|};
