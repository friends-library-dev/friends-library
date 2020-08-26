import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList, AudioResource } from '../types';
import AudioListItem from '../components/AudioListItem';
import { useSelector } from '../state';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'All Audiobooks'>;
  route: RouteProp<StackParamList, 'All Audiobooks'>;
}

const AllAudio: React.FC<Props> = ({ navigation }) => {
  const audios = useSelector((state) => Object.values(state.audioResources));

  const renderItem: (props: { item: AudioResource }) => JSX.Element = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.navigate(`Audio`, { audioId: item.id })}>
      <AudioListItem id={item.id} title={item.title} friend={item.friend} />
    </TouchableOpacity>
  );

  return (
    <FlatList data={audios} renderItem={renderItem} keyExtractor={(item) => item.id} />
  );
};

export default AllAudio;
