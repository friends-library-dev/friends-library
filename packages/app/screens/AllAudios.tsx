import React, { useEffect } from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList, AudioResource } from '../types';
import AudioListItem from '../components/AudioListItem';
import { useSelector, useDispatch } from '../state';
import { downloadFile } from '../state/filesystem';
import * as keys from '../lib/keys';
import FS from '../lib/fs';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'All Audiobooks'>;
  route: RouteProp<StackParamList, 'All Audiobooks'>;
}

const AllAudio: React.FC<Props> = ({ navigation }) => {
  const dispatch = useDispatch();
  const { audios, files } = useSelector((state) => ({
    audios: Object.values(state.audioResources),
    files: state.filesystem,
  }));

  useEffect(() => {
    audios.forEach((audio) => {
      const path = keys.artworkFilePath(audio.id);
      if (!files[path]) {
        dispatch(downloadFile(path, audio.artwork));
      }
    });
  }, []);

  const renderItem: (props: { item: AudioResource }) => JSX.Element = ({ item }) => {
    const path = keys.artworkFilePath(item.id);
    let artworkUrl = item.artwork;
    if (files[path]) {
      artworkUrl = `file://${FS.abspath(path)}`;
    }

    return (
      <TouchableOpacity onPress={() => navigation.navigate(`Audio`, { audio: item })}>
        <AudioListItem
          id={item.id}
          title={item.title}
          friend={item.friend}
          artworkUrl={artworkUrl}
        />
      </TouchableOpacity>
    );
  };

  return (
    <FlatList data={audios} renderItem={renderItem} keyExtractor={(item) => item.id} />
  );
};

export default AllAudio;
