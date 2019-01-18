// @flow
import { configureStore } from 'redux-starter-kit';
import { combineReducers } from 'redux';
import { defaultState as githubDefaultState } from './reducers/github-reducer';
import { defaultState as prefsDefaultState } from './reducers/prefs-reducer';
import { defaultState as defaultSearchState } from './reducers/search-reducer';
import rootReducer from './reducers';

const defaultState = {
  version: 1,
  screen: 'TASKS',
  currentTask: null,
  tasks: {},
  repos: [],
  search: defaultSearchState,
  github: githubDefaultState,
  prefs: prefsDefaultState,
  network: [],
};

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('jones');
    if (serializedState == null) {
      return {};
    }
    return JSON.parse(serializedState);
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

  store.subscribe(() => saveState(store.getState()));

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
