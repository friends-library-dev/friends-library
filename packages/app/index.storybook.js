import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import StorybookUI from './storybook';
import { setLocale } from '@friends-library/locale';
import { LANG } from './env';

setLocale(LANG);

AppRegistry.registerComponent(`FriendsLibrary`, () => StorybookUI);
