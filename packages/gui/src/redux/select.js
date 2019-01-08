// @flow
import { values } from '../components/utils';
import type { Friend, Document, Edition, File, State, Task } from './type';

type Callbacks = {
  friend?: (friend: Friend) => *,
  document?: (document: Document, friend: Friend) => *,
  edition?: (edition: Edition, document: Document, friend: Friend) => *,
  file?: (file: File, edition: Edition, document: Document, friend: Friend) => *,
};

const defaultCbs = {
  friend: (_friend) => {},
  document: (_doc, _friend) => {},
  edition: (_ed, _doc, _friend) => {},
  file: (_file, _ed, _doc, _friend) => {},
};

export function friendsIterator(
  friends: { [string]: Friend },
  cbs: Callbacks = {},
): void {
  const callbacks = Object.assign({}, defaultCbs, cbs);
  values(friends).forEach(friend => {
    callbacks.friend(friend);
    friendIterator(friend, callbacks);
  });
}

export function friendIterator(
  friend: Friend,
  cbs: Callbacks = {},
): void {
  const callbacks = Object.assign({}, defaultCbs, cbs);
  values(friend.documents).forEach(document => {
    callbacks.document(document, friend);
    values(document.editions).forEach(edition => {
      callbacks.edition(edition, document, friend);
      values(edition.files).forEach(file => {
        callbacks.file(file, edition, document, friend);
      });
    });
  });
}

export function currentTaskFriend(state: State): { friend: Friend, task: Task} {
  const task = state.tasks[state.currentTask];
  const friendSlug = task.repo;
  const friend = state.friends[`en/${friendSlug}`];
  return { task, friend };
}
