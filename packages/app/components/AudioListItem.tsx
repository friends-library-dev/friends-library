import React from 'react';
import { Text, View, Image, Platform } from 'react-native';
import tw from 'tailwind-rn';

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
        <Text
          style={{
            ...tw(`text-xl`),
            ...Platform.select({
              ios: {
                fontFamily: 'Baskerville',
              },
              android: {
                fontFamily: 'serif',
              },
            }),
          }}>
          {title}
        </Text>
        <Text
          style={{
            ...tw(`mt-1`),
            letterSpacing: 1,
            ...Platform.select({
              ios: {
                fontFamily: 'HelveticaNeue-Light',
              },
              android: {
                fontFamily: 'sans-serif',
              },
            }),
          }}>
          {friend}
        </Text>
      </View>
    </View>
  );
};

export default AudioListItem;
