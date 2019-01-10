// @flow
import { configureStore } from 'redux-starter-kit';
import { debounce } from 'lodash';
import { ipcRenderer as ipc } from '../webpack-electron';
import rootReducer from './reducers';
import { defaultState as defaultSearchState } from './reducers/search-reducer';
import * as screens from './screens';

const isDev = process.env.NODE_ENV === 'development';

const defaultState = {
  screen: screens.TASKS,
  currentTask: null,
  editingFile: null,
  tasks: {},
  friends: {},
  repos: {},
  search: defaultSearchState,
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
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    // ¯\_(ツ)_/¯
  }
};


export default function () {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {
      ...defaultState,
      ...isDev ? loadState() : {},
    },
  });

  if (isDev) {
    store.subscribe(() => saveState(store.getState()));
  }

  store.subscribe(debounce(
    () => ipc.send('storage:update-state', store.getState()),
    2500,
  ));

  // $FlowFixMe
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      /* eslint-disable-next-line global-require */
      const nextReducer = require('./reducers').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}
