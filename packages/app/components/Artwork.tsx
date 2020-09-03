import React, { useEffect } from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { useSelector, useDispatch } from '../state';
import { downloadFile } from '../state/filesystem';
import * as select from '../state/selectors';

interface Props {
  id: string;
  size: number;
  style?: ViewStyle;
}

const Artwork: React.FC<Props> = ({ id, size, style = {} }) => {
  const dispatch = useDispatch();
  const artwork = useSelector((state) => select.artwork(id, state));

  useEffect(() => {
    if (artwork && !artwork.downloaded) {
      dispatch(downloadFile(artwork.path, artwork.networkUrl));
    }
  }, [dispatch, artwork]);

  if (!artwork) return null;

  return (
    <View style={{ width: size, height: size, ...style }}>
      <Image source={{ uri: artwork.uri, width: size, height: size }} />
    </View>
  );
};

export default Artwork;
