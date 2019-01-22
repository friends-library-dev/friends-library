// @flow
import type { ReduxThunk, Dispatch, State, SearchResult } from '../type';
import { currentTask } from '../select';
import { goToSearchResult } from '../lib/ace';

export function replaceAll({ results, replace }: *): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const task = currentTask(getState());
    if (!task) {
      return;
    }
    dispatch({
      type: 'REPLACE_IN_RESULTS',
      payload: {
        results,
        replace,
        taskId: task.id,
      }
    });
  }
}

export function replaceInResult({ result, replace }: Object): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const task = currentTask(getState());
    if (!task) {
      return;
    }
    dispatch({
      type: 'REPLACE_IN_RESULT',
      payload: {
        result,
        replace,
        taskId: task.id,
      }
    });

    goToSearchResult(result, replace);
  }
}

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

    goToSearchResult(result);
  }
}
