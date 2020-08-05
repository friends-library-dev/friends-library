import React from 'react';
import { FlatList, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList, AudioResource } from '../types';
import AudioListItem from '../components/AudioListItem';
import { useAudios } from '../lib/hooks';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'All Audiobooks'>;
  route: RouteProp<StackParamList, 'All Audiobooks'>;
}

const AllAudio: React.FC<Props> = ({ navigation }) => {
  const audios = useAudios();
  const renderItem = ({ item }: { item: AudioResource }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate(`Audio`, { id: item.id })}>
      <AudioListItem
        id={item.id}
        title={item.title}
        friend={item.friend}
        artworkUrl={item.artwork}
      />
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={[...audios.values()]}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default AllAudio;
