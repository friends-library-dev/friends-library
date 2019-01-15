// @flow
import github from './github-reducer';
import tasks from './tasks-reducer';
import currentTask from './current-task-reducer';
import screen from './screen-reducer';
import repos from './repos-reducer';

export default {
  github,
  tasks,
  currentTask,
  screen,
  repos,
  version: () => 1,
};
