import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { loadAudios, fetchAudios } from '../state/audio-resources';
import { useDispatch } from '../state';
import FS from '../lib/fs';
import Home from '../screens/Home';
import AllAudios from '../screens/AllAudios';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function initApp(): Promise<void> {
      await FS.init();
      dispatch(loadAudios());
      dispatch(fetchAudios());
      SplashScreen.hide();
    }
    initApp();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="All Audiobooks" component={AllAudios} />
        {/* <Stack.Screen name="Settings" component={Settings} />
      <Stack.Screen name="Audio" component={Audio} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
