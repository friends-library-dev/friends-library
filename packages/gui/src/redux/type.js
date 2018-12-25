// @flow
import type { Slug, Title, Uuid, Name } from '../../../../type';

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
  type: string,
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
|};

export type Repo = {
  slug: Slug,
};

export type Repos = {
  [string]: Repo,
};

export type Task = {|
  id: Uuid,
  name: string,
  repo: Slug,
  isNew: boolean,
|};
