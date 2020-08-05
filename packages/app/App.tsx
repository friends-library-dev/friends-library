import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import Home from './screens/Home';
import AllAudios from './screens/AllAudios';
import Audio from './screens/Audio';
import Settings from './screens/Settings';
import { StackParamList } from './types';
import Fs from './lib/FileSystem';
import Data from './lib/Data';
import Network from './lib/Network';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  useEffect(() => {
    async function initApp() {
      Network.init();
      await Fs.init();
      await Data.init(); // must be AFTER Fs.init();
      SplashScreen.hide();
    }
    initApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="All Audiobooks" component={AllAudios} />
        <Stack.Screen name="Settings" component={Settings} />
        <Stack.Screen name="Audio" component={Audio} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
