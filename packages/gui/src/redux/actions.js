// @flow
import { createAction } from 'redux-starter-kit';

export const receiveRepos = createAction('RECEIVE_REPOS');
export const receiveFriend = createAction('RECEIVE_FRIEND');
export const changeScreen = createAction('CHANGE_SCREEN');
export const createTask = createAction('CREATE_TASK');
export const updateTask = createAction('UPDATE_TASK');
export const deleteTask = createAction('DELETE_TASK');
export const workOnTask = createAction('WORK_ON_TASK');
export const touchTask = createAction('TOUCH_TASK');
export const receiveRepoFiles = createAction('RECEIVE_REPO_FILES');
export const updateFileContent = createAction('UPDATE_FILE_CONTENT');
export const setEditingFile = createAction('SET_EDITING_FILE');
export const rehydrate = createAction('REHYDRATE');
export const saveFiles = createAction('SAVE_FILES');
