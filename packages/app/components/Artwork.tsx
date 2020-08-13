import React from 'react';
import { View, Image, ViewStyle } from 'react-native';
import FS from '../lib/FileSystem';

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
          uri: FS.artworkImageUri(id, url),
          width: size,
          height: size,
        }}
      />
    </View>
  );
};

export default Artwork;
