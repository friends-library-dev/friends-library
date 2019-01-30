// @flow

import type { Dispatch as ReduxDispatch } from 'redux';

import type {
  Slug,
  Url,
  Title,
  Uuid,
  Name,
  Asciidoc,
  EditionType,
  Sha,
  FilePath,
} from '../../../type';

export type { Sha, FilePath } from '../../../type';

export type Dispatch = ReduxDispatch<*>;

export type DateString = string;

export type Action = {|
  type: string,
  payload?: *,
|};

export type GitHub = {|
  token?: string,
  name?: Name,
  avatar?: Url,
  user?: string,
|};

export type SearchResult = {|
  documentSlug: Slug,
  editionType: string,
  path: FilePath,
  filename: string,
  dismissed?: true,
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

export type Search = {|
  searching: boolean,
  regexp: boolean,
  words: boolean,
  caseSensitive: boolean,
  documentSlug?: ?Slug,
  editionType?: ?EditionType,
  filename?: ?string,
|};

export type Tasks = { [Uuid]: Task };

export type Undoable<T> = {|
  past: Array<T>,
  present: T,
  future: Array<T>,
|};

export type UndoableTasks = Undoable<Tasks>;

export type State = {|
  version: number,
  prefs: Object,
  github: GitHub,
  screen: string,
  currentTask: ?Uuid,
  tasks: UndoableTasks,
  repos: Array<Repo>,
  search: Search,
  network: Array<string>
|};

export type ReduxThunk = (dispatch: Dispatch, getState: () => State) => *;
