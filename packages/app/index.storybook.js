import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import StorybookUI from './storybook';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => StorybookUI);
