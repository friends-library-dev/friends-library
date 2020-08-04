import React from 'react';
import { View, Image } from 'react-native';
import FS from '../lib/FileSystem';

interface Props {
  id: string;
  url: string;
  size: number;
}

const Artwork: React.FC<Props> = ({ id, url, size }) => {
  return (
    <View style={{ width: size, height: size }}>
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
