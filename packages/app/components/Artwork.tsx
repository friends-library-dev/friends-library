import React, { useEffect } from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { useSelector, useDispatch } from '../state';
import { downloadFile } from '../state/filesystem';
import * as keys from '../lib/keys';
import FS from '../lib/fs';

interface Props {
  id: string;
  size: number;
  style?: ViewStyle;
}

const Artwork: React.FC<Props> = ({ id, size, style = {} }) => {
  const dispatch = useDispatch();
  const artworkPath = keys.artworkFilePath(id);
  const { audio, artworkDownloaded } = useSelector((state) => ({
    audio: state.audioResources[id],
    artworkDownloaded: artworkPath in state.filesystem,
  }));

  useEffect(() => {
    if (!artworkDownloaded) {
      dispatch(downloadFile(artworkPath, audio.artwork));
    }
  }, [artworkDownloaded, audio.artwork]);

  return (
    <View style={{ width: size, height: size, ...style }}>
      <Image
        source={{
          uri: artworkDownloaded ? `file://${FS.abspath(artworkPath)}` : audio.artwork,
          width: size,
          height: size,
        }}
      />
    </View>
  );
};

export default Artwork;
