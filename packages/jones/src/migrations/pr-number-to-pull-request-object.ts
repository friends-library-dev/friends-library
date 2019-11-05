import { SavedState } from '../type';

export default function migrate(state: SavedState): SavedState {
  const { tasks, version } = state;
  if (version > 1) {
    return state;
  }

  for (let id in tasks) {
    const task = tasks[id] as any;
    if (typeof task.prNumber === 'number') {
      task.pullRequest = { number: task.prNumber };
      delete task.prNumber;
    }
  }

  return state;
}
