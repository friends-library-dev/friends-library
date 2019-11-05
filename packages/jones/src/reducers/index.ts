import github from './github-reducer';
import tasks from './tasks-reducer';
import currentTask from './current-task-reducer';
import screen from './screen-reducer';
import repos from './repos-reducer';
import prefs from './prefs-reducer';
import search from './search-reducer';
import network from './network-reducer';
import { undoable } from './undoable';

export default {
  github,
  tasks: undoable(tasks, 'TASKS', ['WORK_ON_TASK', 'END_CHECKOUT']),
  currentTask,
  screen,
  repos,
  prefs,
  search,
  network,
  version: () => 2,
};
