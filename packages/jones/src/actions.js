// @flow
import { createAction } from 'redux-starter-kit';
import { safeLoad as ymlToJs } from 'js-yaml';
import smalltalk from 'smalltalk';
import type { Slug, Url, Asciidoc } from '../../../type';
import type { Dispatch, State, Task, ReduxThunk, SearchResult } from './type';
import * as gh from './lib/github-api';
import { goToSearchResult } from './lib/ace';
import { ORG } from './lib/github-api';
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
export const cancelSearch = createAction('CANCEL_SEARCH');


export function editSearchResult(result: SearchResult): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const task = currentTask(getState());
    if (!task) {
      return;
    }
    dispatch({
      type: 'EDIT_SEARCH_RESULT',
      payload: {
        taskId: task.id,
        result: result,
      }
    });
    // defer till next tick so ace editor can init
    setTimeout(() => goToSearchResult(result), 1);
  }
}

function friendYmlUrl(friendSlug: Slug): Url {
  return [
    'https://raw.githubusercontent.com/',
    `${ORG}/friends-library/master/`,
    'packages/friends/yml/en/',
    `${friendSlug}.yml`,
  ].join('');
}

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
    }, 'RESUBMIT_TASK', dispatch);
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

export function fetchFriendRepos() {
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

export function requestGitHubUser() {
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

async function tryGithub(fn:(any) => *, errorType: string, dispatch): Promise<*> {
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

const ghErrorMsgs = {
  SUBMIT_TASK: 'There was an error submitting your task to GitHub. Probably just a temporary glitch on their end. None of your work was lost, try submitting again in a few seconds. 🤞',
  RESUBMIT_TASK: 'There was an error re-submitting your task to GitHub. Probably just a temporary glitch on their end. None of your work was lost, try submitting again in a few seconds. 🤞',
  CHECKOUT: 'There was an error retrieving source files to edit. Probably just a temporary glitch with GitHub. Try again in a few seconds. 🤞',
}
