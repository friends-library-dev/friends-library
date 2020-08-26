import React from 'react';
import { View, Image, ViewStyle } from 'react-native';

interface Props {
  id: string;
  url: string;
  size: number;
  style?: ViewStyle;
}

const Artwork: React.FC<Props> = ({ id, url, size, style = {} }) => {
  return (
    <View style={{ width: size, height: size, ...style }}>
      <Image
        source={{
          uri: url, // @TODO download and use local image
          width: size,
          height: size,
        }}
      />
    </View>
  );
};

export default Artwork;
