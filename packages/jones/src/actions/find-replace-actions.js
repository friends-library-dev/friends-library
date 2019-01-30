// @flow
import defer from 'lodash/defer';
import type { ReduxThunk, Dispatch, State, SearchResult } from '../type';
import { currentTask } from '../select';
import { goToSearchResult, clearSearchResultHighlights } from '../lib/ace';

export function findInCurrentFile(): ReduxThunk {
  return (dispatch: Dispatch, getState: () => State) => {
    const task = currentTask(getState());
    if (!task || !task.editingFile) {
      return;
    }
    const [documentSlug, editionType, filename] = task.editingFile.split('/');
    dispatch({
      type: 'UPDATE_SEARCH',
      payload: {
        searching: true,
        documentSlug,
        editionType,
        filename,
      }
    });
  }
}

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

    defer(() => clearSearchResultHighlights());
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
