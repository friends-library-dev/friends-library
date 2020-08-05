import React from 'react';
import { Text, View } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../types';
import { useAudios } from '../lib/hooks';
import Artwork from '../components/Artwork';
import { Serif, Sans } from '../components/Text';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Audio: React.FC<Props> = ({ route }) => {
  const id = route.params.id;
  const [audios] = useAudios();
  const audio = audios.get(id);
  if (!audio) return <Text>Error loading audiobook.</Text>;
  return (
    <View>
      <Artwork id={audio.id} url={audio.artwork} size={200} />
      <Serif size={30}>{audio.title}</Serif>
    </View>
  );
};

export default Audio;
