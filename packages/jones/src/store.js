// @flow
import { configureStore } from 'redux-starter-kit';
import { combineReducers } from 'redux';
import type { State } from './type';
import { defaultState as prefsDefaultState } from './reducers/prefs-reducer';
import { defaultState as defaultSearchState } from './reducers/search-reducer';
import rootReducer from './reducers';

const defaultState: State = {
  version: 1,
  screen: 'TASKS',
  currentTask: null,
  tasks: {
    past: [],
    present: {},
    future: [],
  },
  repos: [],
  search: defaultSearchState,
  github: {},
  prefs: prefsDefaultState,
  network: [],
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('jones');
    if (serializedState == null) {
      return {};
    }
    const state = JSON.parse(serializedState);
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
    const serializedState = JSON.stringify(state);
    localStorage.setItem('jones', serializedState);
  } catch (err) {
    // ¯\_(ツ)_/¯
  }
};

const sliceReducer = combineReducers(rootReducer);

const reducer = (state, action) => {
  if (action.type === 'HARD_RESET') {
    localStorage.removeItem('jones');
    state = {
      ...defaultState,
      github: state.github,
    };
  }

  return sliceReducer(state, action);
}

export default function () {

  const store = configureStore({
    reducer,
    preloadedState: {
      ...defaultState,
      ...loadState(),
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
