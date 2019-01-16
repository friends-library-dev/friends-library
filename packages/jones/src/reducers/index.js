// @flow
import github from './github-reducer';
import tasks from './tasks-reducer';
import currentTask from './current-task-reducer';
import screen from './screen-reducer';
import repos from './repos-reducer';
import prefs from './prefs-reducer';
import search from './search-reducer';

export default {
  github,
  tasks,
  currentTask,
  screen,
  repos,
  prefs,
  search,
  version: () => 1,
};
