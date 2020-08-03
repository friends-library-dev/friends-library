import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList, AudioResource } from '../types';
import AudioListItem from '../components/AudioListItem';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Audio: React.FC<Props> = ({ navigation }) => {
  const [audioResources, setAudioResources] = useState<AudioResource[]>([]);
  useEffect(() => {
    async function fetchAudio() {
      try {
        const res = await fetch(`https://api.friendslibrary.com/app-audios`);
        const resources = (await res.json()) as AudioResource[];
        setAudioResources(resources);
      } catch {
        // ¯\_(ツ)_/¯
      }
    }
    fetchAudio();
  }, []);

  const renderItem = ({ item }: { item: AudioResource }) => (
    <AudioListItem
      key={item.id}
      title={item.title}
      friend={item.friend}
      artworkUrl={item.artwork}
    />
  );

  return (
    <View>
      <FlatList
        data={audioResources}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export default Audio;
