import React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import tw from 'tailwind-rn';
import { StackParamList } from '../types';
import { useAudios, usePlayer, useSettings } from '../lib/hooks';
import Artwork from '../components/Artwork';
import { Serif, Sans } from '../components/Text';
import DownloadableChapter from '../components/DownloadableChapter';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Audio: React.FC<Props> = ({ route }) => {
  const { audioQuality: quality } = useSettings();
  const [state, Player] = usePlayer();
  const id = route.params.id;
  const audios = useAudios();
  const audio = audios.get(id);
  if (!audio) return <Text>Error loading audiobook.</Text>;
  const playing =
    ![`STOPPED`, `PAUSED`].includes(state.playbackState) &&
    state.trackAudioId === audio.id;
  return (
    <View>
      <View style={tw(`flex-row`)}>
        <Artwork id={audio.id} url={audio.artwork} size={200} />
        <TouchableOpacity
          onPress={() => {
            if (playing) {
              Player.pause();
              return;
            }
            if (state.trackAudioId === audio.id) {
              Player.play();
            } else {
              Player.playPart(audio.parts[0], quality);
            }
          }}>
          <Serif size={50}>{playing ? 'PAUSE' : `PLAY`}</Serif>
        </TouchableOpacity>
      </View>
      <Serif size={30}>{audio.title}</Serif>
      {audio.parts.map((part) => (
        <DownloadableChapter key={`${audio.id}--${part.index}`} part={part} />
      ))}
    </View>
  );
};

export default Audio;
