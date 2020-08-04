import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import Home from './screens/Home';
import Audio from './screens/Audio';
import Settings from './screens/Settings';
import { StackParamList } from './types';
import Fs from './lib/FileSystem';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  useEffect(() => {
    async function initApp() {
      await Fs.init();
      SplashScreen.hide();
    }
    initApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Audio" component={Audio} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
