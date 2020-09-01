import React, { useState, useEffect } from 'react';
import { Store, AnyAction } from 'redux';
import { Provider } from 'react-redux';
import getStore from '../state/store';
import App from './App';

const AppShell: React.FC = () => {
  const [store, setStore] = useState<null | Store<any, AnyAction>>(null);
  useEffect(() => {
    getStore().then(setStore);
  }, []);

  if (!store) return null;

  return (
    <Provider store={store}>
      <App />
    </Provider>
  );
};

export default AppShell;
