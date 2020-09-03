import React from 'react';
import { View } from 'react-native';
import tw from '../lib/tailwind';
import { shortTitle } from '../lib/utils';
import { Sans, Serif } from './Text';
import Artwork from './Artwork';

interface Props {
  id: string;
  title: string;
  friend: string;
}

const AudioListItem: React.FC<Props> = ({ id, title, friend }) => {
  return (
    <View style={tw(`flex-row p-2 border-b border-gray-500`)}>
      <Artwork id={id} size={90} />
      <View style={tw(`flex-col m-2 flex-shrink`)}>
        <Serif size={22} style={tw(`pb-1`)} numberOfLines={2}>
          {shortTitle(title)}
        </Serif>
        {!friend.startsWith(`Compila`) && <Sans size={16}>{friend}</Sans>}
      </View>
    </View>
  );
};

export default AudioListItem;
