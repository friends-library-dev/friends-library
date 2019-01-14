// @flow
import { createAction } from 'redux-starter-kit';
import type { Asciidoc } from '../../../../type';
import type { Dispatch, State } from './type';
import { currentTaskFriend, editedCurrentTaskFiles, searchedFiles } from './select';
import { ipcRenderer as ipc } from '../webpack-electron';

export const receiveRepos = createAction('RECEIVE_REPOS');
export const receiveFriend = createAction('RECEIVE_FRIEND');
export const changeScreen = createAction('CHANGE_SCREEN');
export const createTask = createAction('CREATE_TASK');
export const updateTask = createAction('UPDATE_TASK');
export const deleteTask = createAction('DELETE_TASK');
export const workOnTask = createAction('WORK_ON_TASK');
export const touchTask = createAction('TOUCH_TASK');
export const collapseTask = createAction('COLLAPSE_TASK');
export const receiveRepoFiles = createAction('RECEIVE_REPO_FILES');
export const updateFileContent = createAction('UPDATE_FILE_CONTENT');
export const setEditingFile = createAction('SET_EDITING_FILE');
export const rehydrate = createAction('REHYDRATE');
export const saveFiles = createAction('SAVE_FILES');
export const increaseEditorFontSize = createAction('INCREASE_EDITOR_FONT_SIZE');
export const decreaseEditorFontSize = createAction('DECREASE_EDITOR_FONT_SIZE');


export function updateSearch(payload: Object) {
  return (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: 'UPDATE_SEARCH', payload });
    searchedFiles(getState()).filter(f => f.diskContent === null).forEach(f => {
      ipc.send('request:filecontent', f.path);
    });
  };
}

export function saveCurrentTaskEditedFiles() {
  return (dispatch: Dispatch, getState: () => State) => {
    const state = getState();
    const { friend, task } = currentTaskFriend(state);
    const editedFiles = editedCurrentTaskFiles(state);
    if (editedFiles.length > 0) {
      ipc.send('save:files', editedFiles);
      ipc.send('commit:wip', friend.slug);
      dispatch(touchTask(task.id));
      dispatch(saveFiles(friend.slug));
    }
  };
}

export function updateEditingFile(
  content: {
    diskContent?: Asciidoc,
    editedContent?: Asciidoc,
  },
) {
  return (dispatch: Dispatch, getState: () => State) => {
    const { editingFile } = getState();
    dispatch(updateFileContent({
      lang: editingFile.lang,
      friendSlug: editingFile.friend,
      documentSlug: editingFile.document,
      editionType: editingFile.edition,
      filename: editingFile.filename,
      ...content,
    }));
  };
}
