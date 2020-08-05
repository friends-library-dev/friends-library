import React from 'react';
import { FlatList } from 'react-native';
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
  const [, audiosArray] = useAudios();
  const renderItem = ({ item }: { item: AudioResource }) => (
    <AudioListItem
      id={item.id}
      title={item.title}
      friend={item.friend}
      artworkUrl={item.artwork}
    />
  );

  return (
    <FlatList
      data={audiosArray}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
    />
  );
};

export default AllAudio;
