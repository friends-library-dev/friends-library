import { configureStore } from 'redux-starter-kit';
import { combineReducers } from 'redux';
import localForage from 'localforage';
import { State, SavedState, Action } from './type';
import { defaultState as prefsDefaultState } from './reducers/prefs-reducer';
import { defaultState as defaultSearchState } from './reducers/search-reducer';
import { emptyUndoable } from './reducers/undoable';
import rootReducer from './reducers';
import migrate from './migrations';

const defaultState: State = {
  version: 2,
  screen: 'TASKS',
  currentTask: undefined,
  tasks: emptyUndoable(),
  repos: [],
  search: defaultSearchState,
  github: { token: null },
  prefs: prefsDefaultState,
  network: [],
};

async function loadState() {
  try {
    let state = (await localForage.getItem('jones')) as SavedState;
    state = state || getLegacyState() || {};
    state = migrate(state);
    return {
      ...state,
      tasks: {
        past: [],
        present: state.tasks || {},
        future: [],
      },
    };
  } catch (err) {
    return {};
  }
}

const saveState = (state: State) => {
  try {
    localForage.setItem('jones', state);
  } catch (err) {
    // ¯\_(ツ)_/¯
  }
};

const sliceReducer = combineReducers(rootReducer);

const reducer = (state: any = defaultState, action: Action) => {
  if (action.type === 'HARD_RESET') {
    localForage.removeItem('jones');
    return {
      ...defaultState,
      github: state.github,
    };
  }

  return sliceReducer(state, action);
};

export default async function() {
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
    const state = store.getState();
    saveState({
      ...state,
      tasks: state.tasks.present,
    });
  });

  // @ts-ignore
  if (module.hot) {
    // @ts-ignore
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

  localStorage.setItem(
    'jones',
    JSON.stringify({
      ...state,
      convertedToIndexedDB: true,
    }),
  );

  return state;
}
