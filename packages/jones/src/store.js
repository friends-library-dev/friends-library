// @flow
import { configureStore } from 'redux-starter-kit';
import { combineReducers } from 'redux';
import localForage from 'localforage';
import type { State } from './type';
import { defaultState as prefsDefaultState } from './reducers/prefs-reducer';
import { defaultState as defaultSearchState } from './reducers/search-reducer';
import { emptyUndoable } from './reducers/undoable';
import rootReducer from './reducers';

const defaultState: State = {
  version: 1,
  screen: 'TASKS',
  currentTask: null,
  tasks: emptyUndoable(),
  repos: [],
  search: defaultSearchState,
  github: {},
  prefs: prefsDefaultState,
  network: [],
};

async function loadState() {
  try {
    let state = await localForage.getItem('jones');
    state = state || getLegacyState() || {};
    return {
      ...state,
      tasks: {
        past: [],
        present: state.tasks || {},
        future: [],
      }
    }
  } catch (err) {
    return {};
  }
};

const saveState = (state) => {
  try {
    localForage.setItem('jones', state);
  } catch (err) {
    // ¯\_(ツ)_/¯
  }
};

const sliceReducer = combineReducers(rootReducer);

const reducer = (state: State = defaultState, action) => {
  if (action.type === 'HARD_RESET') {
    localForage.removeItem('jones');
    return {
      ...defaultState,
      github: state.github,
    };
  }

  return sliceReducer(state, action);
}

export default async function () {
  const savedState = await loadState();
  const store = configureStore({
    reducer,
    preloadedState: {
      ...defaultState,
      ...savedState,
      ...{ network: [] },
    },
  });

  store.subscribe(() => {
    const state = store.getState()
    saveState({
      ...state,
      tasks: state.tasks.present,
    });
  });

  // $FlowFixMe
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // eslint-disable global-require
      const nextReducer = require('./reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

function getLegacyState(): Object | null {
  const serialized = localStorage.getItem('jones');
  if (serialized == null) {
    return null;
  }
  const state = JSON.parse(serialized);

  // we already did the conversion once, so act like the legacy data
  // isn't there -- because I don't want to delete legacy data (for now)
  // so I can recover work in case I made a horrible mistake
  if (!state || state.convertedToIndexedDB === true) {
    return null;
  }

  localStorage.setItem('jones', JSON.stringify({
    ...state,
    convertedToIndexedDB: true,
  }));

  return state;
}
