// @flow
import { configureStore } from 'redux-starter-kit';
import { combineReducers } from 'redux';
import { defaultState as githubDefaultState } from './reducers/github-reducer';
import { defaultState as prefsDefaultState } from './reducers/prefs-reducer';
import rootReducer from './reducers';

const defaultState = {
  version: 1,
  screen: 'TASKS',
  currentTask: null,
  tasks: {},
  repos: [],
  github: githubDefaultState,
  prefs: prefsDefaultState,
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
    state = undefined;
  }

  return sliceReducer(state, action);
}

export default function () {

  const store = configureStore({
    reducer,
    preloadedState: {
      ...defaultState,
      ...loadState(),
      // ...{
      //   screen: 'TASKS',
      //   tasks: {},
      //   currentTask: null,
      //   repos: [],
      // },
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
