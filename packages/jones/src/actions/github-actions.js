// @flow
import smalltalk from 'smalltalk';
import * as gh from '../lib/github-api';
import { safeLoad as ymlToJs } from 'js-yaml';
import type { Slug, Url } from '../../../../type';
import type { Task, ReduxThunk, Dispatch, State } from '../type';

export function submitTask(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { github: { user } } = getState();
    dispatch({ type: 'SUBMITTING_TASK' });
    const pr = await tryGithub(async () => {
      return await gh.createNewPullRequest(task, user)
    }, 'SUBMIT_TASK', dispatch);
    if (pr) {
      dispatch({ type: 'TASK_SUBMITTED', payload: {
        id: task.id,
        prNumber: pr.number,
        parentCommit: pr.commit,
      }});
    }
  };
}

export function resubmitTask(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    const { github: { user } } = getState();
    dispatch({ type: 'RE_SUBMITTING_TASK' });
    const sha = await tryGithub(async () => {
      return await gh.addCommit(task, user);
    }, 'SUBMIT_TASK', dispatch);
    if (sha) {
      dispatch({
        type: 'TASK_RE_SUBMITTED',
        payload: {
          id: task.id,
          parentCommit: sha,
        }
      });
    }
  };
}

export function checkout(task: Task): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: 'START_CHECKOUT' });

    const data = await tryGithub(async () => {
      const repoSlug = await gh.getRepoSlug(task.repoId);
      const parentCommit = await gh.getHeadSha(repoSlug, 'master');
      let files = await gh.getAdocFiles(repoSlug, parentCommit);
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
      return Promise.resolve({ documentTitles, files, parentCommit });
    }, 'CHECKOUT', dispatch);

    if (data) {
      dispatch({ type: 'END_CHECKOUT' });
      dispatch({
        type: 'UPDATE_TASK',
        payload: {
          id: task.id,
          data,
        }
      });
    } else {
      dispatch({ type: 'CHANGE_SCREEN', payload: 'TASKS' });
    }
  }
}

export function fetchFriendRepos(): ReduxThunk {
  return async (dispatch: Dispatch, getState: () => State) => {
    dispatch({ type: 'REQUEST_FRIEND_REPOS' });
    let repos;
    try {
      const friendRepos = await gh.getFriendRepos();
      // filter out any friend repos that don't have a yml file yet
      const ymlsPath = '/repos/:owner/:repo/contents/packages/friends/yml/en';
      const { data: ymls } = await gh.req(ymlsPath, { repo: 'friends-library' });
      repos = friendRepos.filter(repo => {
        return !!ymls.find(y => y.name === `${repo.name}.yml`);
      });
    } catch (e) {
      dispatch({ type: 'NETWORK_ERROR' });
      return;
    }
    dispatch({ type: 'RECEIVE_FRIEND_REPOS', payload: repos });
  }
}

export function requestGitHubUser(): ReduxThunk {
  return async (dispatch: Dispatch) => {
    dispatch({ type: 'REQUEST_GITHUB_USER' });
    const { data: user } = await gh.req('/user');
    dispatch({
      type: 'RECEIVE_GITHUB_USER',
      payload: {
        name: user.name,
        avatar: user.avatar_url,
        user: user.login,
      }
    });
  }
}

async function tryGithub(
  fn: (any) => *,
  errorType: string,
  dispatch: Dispatch,
): Promise<*> {
  let result;
  try {
    // $FlowFixMe
    result = await fn();
  } catch (e) {
    dispatch({ type: 'NETWORK_ERROR' });
    alertGithubError(errorType);
    return false;
  }
  return result;
}

function alertGithubError(type: string) {
  smalltalk.alert(
    '😬 <b style="color: red;">Network Error</b>',
    ghErrorMsgs[type],
  );
}

function friendYmlUrl(friendSlug: Slug): Url {
  return [
    'https://raw.githubusercontent.com/',
    `${gh.ORG}/friends-library/master/`,
    'packages/friends/yml/en/',
    `${friendSlug}.yml`,
  ].join('');
}

const ghErrorMsgs = {
  SUBMIT_TASK: 'There was an error submitting your task to GitHub. Probably just a temporary glitch on their end. None of your work was lost, try submitting again in a few seconds. 🤞',
  CHECKOUT: 'There was an error retrieving source files to edit. Probably just a temporary glitch with GitHub. Try again in a few seconds. 🤞',
}
