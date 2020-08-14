import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import SplashScreen from 'react-native-splash-screen';
import { SettingsContext, AudiosContext, PlayerContext } from './lib/context';
import Home from './screens/Home';
import AllAudios from './screens/AllAudios';
import Audio from './screens/Audio';
import Settings from './screens/Settings';
import {
  StackParamList,
  UserSettings,
  AudioResource,
  PlayerState,
} from './types';
import Fs from './lib/FileSystem';
import Data from './lib/Data';
import Player from './lib/Player';
import Network from './lib/Network';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  const [settings, setSettings] = useState<UserSettings>(Data.userSettings);
  const [playerState, setPlayerState] = useState<PlayerState>(
    Player.defaultState,
  );
  const [audios, setAudios] = useState<Map<string, AudioResource>>(
    Data.audioResources,
  );
  console.log('render!');

  useEffect(() => {
    Player.getInstance().addListener(`state:updated`, (newstate) => {
      setPlayerState(newstate);
      console.log({ emiddted: newstate });
    });
    return () => {
      Player.getInstance().removeListener(`state:updated`, setPlayerState);
    };
  }, [Player.getInstance(), setPlayerState]);

  useEffect(() => {
    Data.addListener(`updated:user-settings`, setSettings);
    return () => {
      Data.removeListener(`updated:user-settings`, setSettings);
    };
  }, [Data, setSettings]);

  useEffect(() => {
    Data.addListener(`updated:audio-resources`, setAudios);
    return () => {
      Data.removeListener(`updated:audio-resources`, setAudios);
    };
  }, [Data, setAudios]);

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
    <AudiosContext.Provider value={audios}>
      <SettingsContext.Provider value={settings}>
        <PlayerContext.Provider value={playerState}>
          <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
              <Stack.Screen name="Home" component={Home} />
              <Stack.Screen name="All Audiobooks" component={AllAudios} />
              <Stack.Screen name="Settings" component={Settings} />
              <Stack.Screen name="Audio" component={Audio} />
            </Stack.Navigator>
          </NavigationContainer>
        </PlayerContext.Provider>
      </SettingsContext.Provider>
    </AudiosContext.Provider>
  );
};

export default App;
