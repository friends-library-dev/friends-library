import React from 'react';
import { AppRegistry } from 'react-native';
import SplashScreen from 'react-native-splash-screen';
import { getStorybookUI, configure, addDecorator } from '@storybook/react-native';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { State, INITIAL_STATE } from '../state';
import './rn-addons';

const store = createStore(() => {
  const state: State = {
    ...INITIAL_STATE,
    audioResources: {
      webb: {
        id: `webb`,
        date: `2016-08-03T04:00:00.000Z`,
        title: `A Letter of Elizabeth Webb`,
        friend: `Elizabeth Webb`,
        reader: `Jason R. Henderson`,
        artwork: `https://flp-assets.nyc3.digitaloceanspaces.com/en/elizabeth-webb/letter/updated/Letter_of_Elizabeth_Webb--updated--audio.png`,
        description: `Elizabeth Webb (1663-1726) was an early minister in the Society of Friends who travelled extensively in her service for the gospel. In the year 1712, while ministering in London, she became acquainted with Anthony William Boehm, then chaplain to Prince George of Denmark. At some point following their initial interview, Elizabeth Webb felt constrained in the love of God to write to Boehm and present him with the deeply instructive letter contained in this booklet, giving something of a summary of her spiritual pilgrimage.`,
        shortDescription: `A letter from Elizabeth Webb written to Anthony William Boehm (chaplain to Prince George of Denmark), in which she describes her own spiritual journey, and her experience of the Lord’s judgments and mercies as she gave up resolutely to follow Him.`,
        parts: [
          {
            audioId: `webb`,
            index: 0,
            title: `The Life of Elizabeth Webb`,
            duration: 2848,
            size: 50831853,
            sizeLq: 17091654,
            url: `https://flp-assets.nyc3.digitaloceanspaces.com/en/elizabeth-webb/letter/updated/Letter_of_Elizabeth_Webb.mp3`,
            urlLq: `https://flp-assets.nyc3.digitaloceanspaces.com/en/elizabeth-webb/letter/updated/Letter_of_Elizabeth_Webb--lq.mp3`,
          },
        ],
      },
    },
  };
  return state;
}, applyMiddleware(thunk));

SplashScreen.hide();

addDecorator((Story: any) => (
  <Provider store={store}>
    <Story />
  </Provider>
));

// import stories
configure(() => {
  require(`./stories`);
  require(`./stories/stories.scrubber`);
  require(`./stories/stories.downloadable-part`);
}, module);

// Refer to https://github.com/storybookjs/storybook/tree/master/app/react-native#start-command-parameters
// To find allowed options for getStorybookUI
const StorybookUIRoot = getStorybookUI({ asyncStorage: null });

// If you are using React Native vanilla and after installation you don't see your app name here, write it manually.
// If you use Expo you can safely remove this line.
AppRegistry.registerComponent(`%APP_NAME%`, () => StorybookUIRoot);

export default StorybookUIRoot;
