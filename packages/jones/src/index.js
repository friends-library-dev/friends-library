// @flow
import * as React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import store from './store';
import './index.css';
import App from './App';

render(
  <Provider store={store()}>
    <App />
  </Provider>,
  // $FlowFixMe
  document.getElementById('root'),
);
