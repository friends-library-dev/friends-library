import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import { setLocale } from '@friends-library/locale';
import AppShell from './components/AppShell';
import { LANG } from './env';

setLocale(LANG);

AppRegistry.registerComponent(`FriendsLibrary`, () => AppShell);
TrackPlayer.registerPlaybackService(() => require(`./playback-service`));
