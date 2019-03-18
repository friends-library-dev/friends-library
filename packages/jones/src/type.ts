import { ActionCreator } from 'redux';

import {
  Slug,
  Url,
  Title,
  Uuid,
  Name,
  Asciidoc,
  EditionType,
  Sha,
  FilePath,
} from '@friends-library/types';

export type Dispatch = ActionCreator<any>;

export type DateString = string;

export type Action = {
  type: string;
  payload?: any;
};

export type GitHub =
  | {
      token: null;
    }
  | {
      token: string;
      name?: Name;
      avatar: Url;
      user: string;
    };

export type SearchResultContext = {
  lineNumber: number;
  content: Asciidoc;
};

export type SearchResult = {
  documentSlug: Slug;
  editionType: string;
  path: FilePath;
  filename: string;
  dismissed?: true;
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
  context: SearchResultContext[];
};

export type File = {
  sha: Sha;
  path: FilePath;
  content: Asciidoc;
  editedContent: Asciidoc | null;
};

export type Task = {
  id: Uuid;
  name: string;
  created: DateString;
  updated: DateString;
  repoId: number;
  isNew: boolean;
  prNumber?: number;
  collapsed: { [key: string]: boolean };
  sidebarOpen: boolean;
  sidebarWidth: number;
  documentTitles: { [key: string]: Title };
  files: { [key: string]: File };
  editingFile?: FilePath;
  parentCommit?: Sha;
};

export type Repo = {
  id: number;
  slug: Slug;
  friendName: Name;
};

export type Search = {
  searching: boolean;
  regexp: boolean;
  words: boolean;
  caseSensitive: boolean;
  documentSlug?: Slug;
  editionType?: EditionType;
  filename?: string;
};

export type Tasks = { [key: string]: Task };

export type Undoable<T> = {
  past: T[];
  present: T;
  future: T[];
};

export type UndoableTasks = Undoable<Tasks>;

export type State = {
  version: number;
  prefs: {
    editorFontSize: number;
  };
  github: GitHub;
  screen: string;
  currentTask?: Uuid;
  tasks: UndoableTasks;
  repos: Repo[];
  search: Search;
  network: string[];
};

export type ReduxThunk = (dispatch: Dispatch, getState: () => State) => any;
