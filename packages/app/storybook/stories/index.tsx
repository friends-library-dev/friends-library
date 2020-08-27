import React from 'react';
import { View } from 'react-native';
import { storiesOf } from '@storybook/react-native';
import AudioListItem from '../../components/AudioListItem';
import AudioControls from '../../components/AudioControls';
import tw from '../../lib/tailwind';

storiesOf(`AudioListItem`, module).add(`default`, () => (
  <AudioListItem id="webb" title="A Letter of Elizabeth Webb" friend="Elizabeth Webb" />
));

storiesOf(`AudioControls`, module)
  .add(`default`, () => (
    <View style={tw(`p-6`)}>
      <AudioControls
        seekForward={() => {}}
        seekBackward={() => {}}
        togglePlayback={() => {}}
        playing={true}
        position={1111}
        duration={3333}
        downloading={false}
        numParts={1}
        progress={3}
      />
    </View>
  ))
  .add(`with skips`, () => (
    <View style={tw(`p-6`)}>
      <AudioControls
        skipNext={() => {}}
        skipBack={() => {}}
        seekForward={() => {}}
        seekBackward={() => {}}
        togglePlayback={() => {}}
        playing={true}
        position={1111}
        duration={3333}
        downloading={false}
        numParts={1}
        progress={3}
      />
    </View>
  ));
