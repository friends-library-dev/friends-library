// @flow
import { createAction } from 'redux-starter-kit';
import type { Dispatch, State } from './type';
import * as gh from './lib/github-api';

export const receiveAccessToken = createAction('RECEIVE_ACCESS_TOKEN');
export const hardReset = createAction('HARD_RESET');
export const changeScreen = createAction('CHANGE_SCREEN');
export const createTask = createAction('CREATE_TASK');
export const deleteTask = createAction('DELETE_TASK');
export const updateTask = createAction('UPDATE_TASK');
export const workOnTask = createAction('WORK_ON_TASK');
// export const fetchFriends = createAction('FETCH_FRIENDS');


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
