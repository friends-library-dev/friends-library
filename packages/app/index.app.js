import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import AppShell from './components/AppShell';

AppRegistry.registerComponent(`FriendsLibrary`, () => AppShell);
TrackPlayer.registerPlaybackService(() => require(`./playback-service`));
