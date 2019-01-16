// @flow
import type {
  Slug,
  Title,
  Uuid,
  Name,
  Asciidoc,
} from '../../../type';

// clean up login screen

export type Dispatch = (any) => *;

export type DateString = string;

export type FilePath = string;

export type Sha = string;

export type GitHub = {|
  token: string,
  name: Name,
  avatar: Url,
  user: string,
|};

export type File = {|
  sha: Sha,
  path: FilePath,
  content: Asciidoc,
  editedContent: Asciidoc,
|};

export type Task = {|
  id: Uuid,
  name: string,
  created: DateString,
  updated: DateString,
  repoId: number,
  isNew: boolean,
  prNumber?: number,
  collapsed: { [string]: boolean },
  sidebarOpen: boolean,
  sidebarWidth: number,
  documentTitles: { [slug]: Title },
  files: { [FilePath]: File },
  editingFile?: FilePath,
  parentCommit?: Sha,
|};

export type Repo = {|
  id: number,
  slug: Slug,
  friendName: Name,
|};

export type State = {|
  github: GitHub,
  screen: string,
  currentTask?: Uuid,
  tasks: { [Uuid]: Task },
  repos: Array<Repo>
  // tasks: { [string]: Task },
  // friends: { [Slug]: Friend },
  // repos: { [string]: Repo },
  // editingFile: EditingFile,
  // search: Search,
|};

export type ReduxThunk = (dispatch: Dispatch, getState: () => State) => *;
