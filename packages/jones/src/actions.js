// @flow
import { createAction } from 'redux-starter-kit';
import type { Dispatch, State } from './type';
import * as gh from './lib/github-api';

export const receiveAccessToken = createAction('RECEIVE_ACCESS_TOKEN');
export const hardReset = createAction('HARD_RESET');


export function requestGitHubUser() {
  return async (dispatch: Dispatch, getState: () => State) => {
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
