// @flow
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './index.css';

render(
  <Provider store={store()}>
    <App />
  </Provider>,
  // $FlowFixMe
  document.getElementById('root'),
);
