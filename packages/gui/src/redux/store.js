// @flow
import { configureStore } from 'redux-starter-kit'
// import isDev from 'electron-is-dev';
// import Storage from 'electron-store';
import rootReducer from './reducers'
import * as screens from './screens';

const isDev = process.env.NODE_ENV === 'development';
console.log({ isDev });

const defaultState = {
  screen: screens.TASKS,
  currentTask: null,
  editingFile: null,
  tasks: {},
  friends: {},
  repos: {},
};



const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
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
    const toSave = isDev ? state : { tasks: state.tasks };
    const serializedState = JSON.stringify(toSave);
    localStorage.setItem('state', serializedState);
  } catch (err) {}
};

export default function() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...defaultState,
      ...loadState(),
    },
  });

  store.subscribe(() => saveState(store.getState()));

  // $FlowFixMe
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const nextReducer = require('./reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
