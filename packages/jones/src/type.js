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
} from '../../../type';

export type Dispatch = (any) => *;

export type DateString = string;

export type GitHub = {|
  token: string,
|};

export type Task = {|
  id: Uuid,
  name: string,
  created: DateString,
  updated: DateString,
  repoId: number,
  isNew: boolean,
  prNumber: ?number,
  collapsed: ?Object,
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
