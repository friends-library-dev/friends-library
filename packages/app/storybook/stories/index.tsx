import React from 'react';
import { Text, View } from 'react-native';
import { storiesOf } from '@storybook/react-native';

storiesOf('Welcome', module).add('to Storybook', () => (
  <View>
    <Text>Storybook</Text>
  </View>
));
