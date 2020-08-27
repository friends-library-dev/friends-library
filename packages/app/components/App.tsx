import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '../types';
import { loadAudios, fetchAudios } from '../state/audio-resources';
import { batchSet as batchSetFilesystem, FilesystemState } from '../state/filesystem';
import { useDispatch } from '../state';
import FS from '../lib/fs';
import Player from '../lib/player';
import Home from '../screens/Home';
import AllAudios from '../screens/AllAudios';
import Audio from '../screens/Audio';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    async function initApp(): Promise<void> {
      Player.init();
      await FS.init();
      // await FS.deleteAll();
      dispatch(
        batchSetFilesystem(
          Object.keys(FS.manifest).reduce((acc, path) => {
            acc[path] = { totalBytes: FS.manifest[path], bytesOnDisk: FS.manifest[path] };
            return acc;
          }, {} as FilesystemState),
        ),
      );
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
        <Stack.Screen name="Audio" component={Audio} />
        {/* <Stack.Screen name="Settings" component={Settings} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
