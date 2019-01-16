// @flow
import type {
  Slug,
  Url,
  Title,
  Uuid,
  Name,
  Asciidoc,
} from '../../../type';

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

export type SearchResult = {|
  filename: string,
  start: {|
    line: number,
    column: number,
  |},
  end: {|
    line: number,
    column: number,
  |},
  context: Array<{|
    lineNumber: number,
    content: Asciidoc,
  |}>
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
  documentTitles: { [Slug]: Title },
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
