// @flow
import { createAction } from 'redux-starter-kit';
import { safeLoad as ymlToJs } from 'js-yaml';
import type { Slug, Url } from '../../../type';
import type { Dispatch, State, Task, ReduxThunk } from './type';
import * as gh from './lib/github-api';
import { currentTask } from './select';

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

function friendYmlUrl(friendSlug: Slug): Url {
  return [
    'https://raw.githubusercontent.com/',
    'friends-library/friends-library/master/',
    'packages/friends/yml/en/',
    `${friendSlug}.yml`,
  ].join('');
}

export function toggleSidebarOpen(adoc: Asciidoc): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const { id } = currentTask(getState());
    dispatch({
      type: 'TOGGLE_SIDEBAR_OPEN',
      payload: { id }
    });
  };
}

export function updateSidebarWidth(width: number): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const { id } = currentTask(getState());
    dispatch({
      type: 'UPDATE_SIDEBAR_WIDTH',
      payload: { id, width }
    });
  };
}

export function updateEditingFile(adoc: Asciidoc): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const task = currentTask(getState());
    dispatch({
      type: 'UPDATE_EDITING_FILE',
      payload: {
        id: task.id,
        adoc,
      }
    });
  };
}

export function checkout(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    const repoSlug = await gh.getRepoSlug(task.repoId);
    const baseCommit = await gh.getHeadSha(repoSlug, 'master');
    let files = await gh.getAdocFiles(repoSlug, baseCommit);
    files = files.reduce((acc, file) => {
      acc[file.path] = file;
      return acc;
    }, {});
    const yml = await fetch(friendYmlUrl(repoSlug)).then(r => r.text());
    const { documents } = ymlToJs(yml);
    const documentTitles = documents.reduce((acc, doc) => {
      acc[doc.slug] = doc.title;
      return acc;
    }, {});

    dispatch({
      type: 'UPDATE_TASK',
      payload: {
        id: task.id,
        data: { documentTitles, files, baseCommit }
      }
    });
  }
}

export function fetchFriendRepos() {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: 'REQUEST_FRIEND_REPOS' });
    const friendRepos = await gh.getFriendRepos();
    dispatch({ type: 'RECEIVE_FRIEND_REPOS', payload: friendRepos });
  }
}

export function requestGitHubUser() {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'REQUEST_GITHUB_USER' });
    const { data: user } = await gh.req('/user');
    dispatch({
      type: 'RECEIVE_GITHUB_USER',
      payload: {
        name: user.name,
        avatar: user.avatar_url,
      }
    });
  }
}
