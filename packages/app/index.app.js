import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import AppShell from './components/AppShell';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => AppShell);
TrackPlayer.registerPlaybackService(() => require(`./playback-service`));
