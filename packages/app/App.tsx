import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Provider } from 'react-redux';
import store from './redux/store';
import Home from './screens/Home';

const App: React.FC = () => {
  useEffect(() => {
    async function initApp(): Promise<void> {
      // any async setup before splashscreen goes away
      SplashScreen.hide();
    }
    initApp();
  }, []);

  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default App;
