import React from 'react';
import { Provider } from 'react-redux';
import store from '../state/store';
import App from './App';

const AppShell: React.FC = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default AppShell;
