import React, { useEffect } from 'react';
import { View, Image, ViewStyle } from 'react-native';
import { useSelector, useDispatch } from '../state';
import { downloadFile } from '../state/filesystem';
import { artwork } from '../state/selectors';

interface Props {
  id: string;
  size: number;
  style?: ViewStyle;
}

const Artwork: React.FC<Props> = ({ id, size, style = {} }) => {
  const dispatch = useDispatch();
  const { path, uri, networkUrl, downloaded } = useSelector((state) =>
    artwork(id, state),
  );

  useEffect(() => {
    if (!downloaded) {
      dispatch(downloadFile(path, networkUrl));
    }
  }, [dispatch, downloaded, networkUrl, path]);

  return (
    <View style={{ width: size, height: size, ...style }}>
      <Image source={{ uri, width: size, height: size }} />
    </View>
  );
};

export default Artwork;
