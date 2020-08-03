import React from 'react';
import { Text, View, Image } from 'react-native';

interface Props {
  title: string;
  friend: string;
  artworkUrl: string;
}

const AudioListItem: React.FC<Props> = ({ title, friend, artworkUrl }) => {
  return (
    <View>
      <Image source={{ uri: artworkUrl, width: 50, height: 50 }} />
      <Text>Title: {title}</Text>
      <Text>Author: {friend}</Text>
    </View>
  );
};

export default AudioListItem;
