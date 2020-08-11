import React, { useReducer } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import tw from 'tailwind-rn';
import { StackParamList, AudioPart } from '../types';
import { usePlayer, useSettings } from '../lib/hooks';
import FS from '../lib/FileSystem';
import Artwork from '../components/Artwork';
import { Serif, Sans } from '../components/Text';
import DownloadablePart from '../components/DownloadablePart';
import { partsReducer, initialPartsState } from './audio-part-state';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Audio: React.FC<Props> = ({ route }) => {
  const { audioQuality: quality } = useSettings();
  const audio = route.params.audio;
  const [partsState, dispatch] = useReducer(
    partsReducer,
    initialPartsState(audio.parts, quality),
  );

  const downloadPart = async (part: AudioPart) => {
    const idx = part.index;
    dispatch({ type: `SET_DOWNLOADING`, idx, downloading: true });
    await FS.downloadAudio(
      part,
      quality,
      progress => dispatch({ type: `SET_PROGRESS`, idx, progress }),
      success => dispatch({ type: `SET_DOWNLOADED`, idx, downloaded: success }),
    );
    dispatch({ type: `SET_DOWNLOADING`, idx, downloading: false });
  };

  const [playerState, Player] = usePlayer();
  const playing =
    ![`STOPPED`, `PAUSED`].includes(playerState.playbackState) &&
    playerState.trackAudioId === audio.id;

  const allPartsDownloaded =
    audio.parts.filter(p => !FS.hasAudio(p, quality)).length === 0;

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
            if (playerState.trackAudioId === audio.id) {
              Player.play();
            } else {
              Player.playPart(audio.parts[0], quality);
            }
          }}>
          <Serif size={50}>{playing ? 'PAUSE' : `PLAY`}</Serif>
        </TouchableOpacity>
      </View>
      <Serif size={30}>{audio.title}</Serif>
      {audio.parts.length > 1 && !allPartsDownloaded && (
        <TouchableOpacity
          onPress={() => {
            partsState
              .filter(s => !s.downloaded && !s.downloading)
              .forEach((_, idx) => downloadPart(audio.parts[idx]));
          }}>
          <Sans>Download All</Sans>
        </TouchableOpacity>
      )}
      {audio.parts.map((part, idx) => (
        <DownloadablePart
          key={`${audio.id}--${part.index}`}
          download={() => downloadPart(part)}
          part={part}
          {...partsState[idx]}
        />
      ))}
    </View>
  );
};

export default Audio;
