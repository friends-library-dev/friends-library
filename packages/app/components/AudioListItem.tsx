import React from 'react';
import { View, Image } from 'react-native';
import tw from 'tailwind-rn';
import { Sans, Serif } from './Text';

interface Props {
  title: string;
  friend: string;
  artworkUrl: string;
}

const AudioListItem: React.FC<Props> = ({ title, friend, artworkUrl }) => {
  return (
    <View style={tw(`flex-row p-2 border-b border-gray-500`)}>
      <Image source={{ uri: artworkUrl, width: 90, height: 90 }} />
      <View style={tw(`flex-col m-2 flex-shrink`)}>
        <Serif size={22}>{title}</Serif>
        <Sans size={16}>{friend}</Sans>
      </View>
    </View>
  );
};

export default AudioListItem;
