// @flow
import { configureStore } from 'redux-starter-kit'
import rootReducer from './reducers'
import * as screens from './screens';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState == null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {}
};

export default function() {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: loadState() || {
      screen: screens.TASKS,
      currentTask: null,
      editingFile: null,
      tasks: {},
      friends: {},
      repos: {},
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
