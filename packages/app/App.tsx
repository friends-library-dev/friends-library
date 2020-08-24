import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { Text, View } from 'react-native';

const App: React.FC = () => {
  useEffect(() => {
    async function initApp(): Promise<void> {
      // any async setup before splashscreen goes away
      SplashScreen.hide();
    }
    initApp();
  }, []);

  return (
    <View>
      <Text>Hello App</Text>
    </View>
  );
};

export default App;
