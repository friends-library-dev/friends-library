// @flow
import { createAction } from 'redux-starter-kit';
import type { Asciidoc } from '../../../../type';
import type { Dispatch, State, ReduxThunk } from '../type';
import { currentTask } from '../select';

export {
  submitTask,
  resubmitTask,
  checkout,
  fetchFriendRepos,
  requestGitHubUser,
} from './github-actions';

export {
  replaceInResult,
  replaceAll,
  editSearchResult,
} from './find-replace-actions';

export const receiveAccessToken = createAction('RECEIVE_ACCESS_TOKEN');
export const hardReset = createAction('HARD_RESET');
export const changeScreen = createAction('CHANGE_SCREEN');
export const createTask = createAction('CREATE_TASK');
export const deleteTask = createAction('DELETE_TASK');
export const updateTask = createAction('UPDATE_TASK');
export const workOnTask = createAction('WORK_ON_TASK');
export const collapseTask = createAction('COLLAPSE_TASK');
export const setEditingFile = createAction('SET_EDITING_FILE');
export const updateSearch = createAction('UPDATE_SEARCH');
export const increaseEditorFontSize = createAction('INCREASE_EDITOR_FONT_SIZE');
export const decreaseEditorFontSize = createAction('DECREASE_EDITOR_FONT_SIZE');
export const cancelSearch = createAction('CANCEL_SEARCH');
export const undoTasks = createAction('UNDO_TASKS');
export const redoTasks = createAction('REDO_TASKS');

export function toggleSidebarOpen(adoc: Asciidoc): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const { id } = currentTask(getState()) || {};
    dispatch({
      type: 'TOGGLE_SIDEBAR_OPEN',
      payload: { id }
    });
  };
}

export function updateSidebarWidth(width: number): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const { id } = currentTask(getState()) || {};
    dispatch({
      type: 'UPDATE_SIDEBAR_WIDTH',
      payload: { id, width }
    });
  };
}

export function updateEditingFile(adoc: Asciidoc): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const task = currentTask(getState()) || {};
    dispatch({
      type: 'UPDATE_EDITING_FILE',
      payload: {
        id: task.id,
        adoc,
      }
    });
  };
}
