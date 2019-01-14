// @flow
import { configureStore } from 'redux-starter-kit';
import rootReducer from './reducers';

export default function () {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: {},
  });

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
