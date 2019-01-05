// @flow
import type { Slug, Title, Uuid, Name, Lang, EditionType, Gender } from '../../../../type';

export type Dispatch = (any) => *;

export type File = {|
  filename: string,
  path: string,
  content?: string,
|};

export type Files = {
  [string]: File,
};

export type Edition = {|
  type: EditionType,
  files: Files,
|};

export type Editions = {
  [string]: Edition,
};

export type Document = {|
  slug: Slug,
  title: Title,
  editions: Editions,
|};

export type Documents = {|
  [string]: Document,
|};

export type Friend = {|
  filesReceived: boolean,
  documents: Documents,
  slug: Slug,
  name: Name,
  gender: Gender,
|};

export type Repo = {
  slug: Slug,
  sshUrl: string,
};

export type Repos = {
  [string]: Repo,
};

export type Task = {|
  id: Uuid,
  name: string,
  repo: Slug,
  isNew: boolean,
  prNumber: ?number,
|};

export type EditingFile = {|
  lang: Lang,
  friend: Slug,
  document: Slug,
  edition: EditionType,
  filename: string,
|};
