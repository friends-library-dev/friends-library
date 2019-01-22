// @flow
import type { UndoableTasks, Action } from '../type';
import github from './github-reducer';
import tasks from './tasks-reducer';
import currentTask from './current-task-reducer';
import screen from './screen-reducer';
import repos from './repos-reducer';
import prefs from './prefs-reducer';
import search from './search-reducer';
import network from './network-reducer';

export default {
  github,
  tasks: undoable(tasks, 'TASKS', ['WORK_ON_TASK', 'END_CHECKOUT']),
  currentTask,
  screen,
  repos,
  prefs,
  search,
  network,
  version: () => 1,
};

function undoable(reducer, key: string, resetters: Array<string> = []) {
  return (state: UndoableTasks = { past: [], present: {}, future: [] }, action: Action) => {
    if (action.type === `RESET_UNDO_${key}` || resetters.includes(action.type)) {
      return {
        past: [],
        present: state.present,
        future: [],
      }
    }

    if (action.type === `UNDO_${key}`) {
      if (state.past.length === 0) {
        return state;
      }
      return {
        present: state.past[state.past.length - 1],
        // $FlowFixMe
        past: state.past.slice(0, state.past.length - 1),
        future: [...state.future, state.present],
      }
    }

    if (action.type === `REDO_${key}`) {
      if (state.future.length === 0) {
        return state;
      }
      return {
        present: state.future[state.future.length - 1],
        past: [...state.past, state.present],
        // $FlowFixMe
        future: state.future.slice(0, state.future.length - 1),
      }
    }

    const newPresent = reducer(state.present, action);
    if (newPresent !== state.present) {
      return {
        past: [...state.past, state.present],
        present: newPresent,
        future: state.future,
      }
    }
    return state;
  }
}
