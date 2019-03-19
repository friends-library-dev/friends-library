import { SavedState } from '../type';
import prNumberToPullRequestObject from './pr-number-to-pull-request-object';

export default function migrate(state: SavedState): SavedState {
  const migrations = [prNumberToPullRequestObject];
  let newState = state;

  migrations.forEach(migration => {
    newState = migration(newState);
  });

  return newState;
}
