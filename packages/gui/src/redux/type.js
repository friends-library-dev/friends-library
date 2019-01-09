// @flow
import type {
  Slug,
  Title,
  Uuid,
  Name,
  Lang,
  EditionType,
  Gender,
  Asciidoc,
} from '../../../../type';

export type Dispatch = (any) => *;

export type DateString = string;

export type File = {|
  filename: string,
  path: string,
  diskContent?: Asciidoc,
  editedContent?: Asciidoc,
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
  created: DateString,
  updated: DateString,
  repo: Slug,
  isNew: boolean,
  prNumber: ?number,
  collapsed: ?Object,
|};

export type EditingFile = {|
  lang: Lang,
  friend: Slug,
  document: Slug,
  edition: EditionType,
  filename: string,
|};

export type State = {|
  screen: string,
  currentTask: Uuid,
  tasks: { [string]: Task },
  friends: { [Slug]: Friend },
  repos: { [string]: Repo },
  editingFile: EditingFile,
|};
