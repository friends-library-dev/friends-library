import React, { useReducer, useState } from 'react';
import { View, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'tailwind-rn';
import { StackParamList, AudioPart } from '../types';
import { usePlayer, useSettings } from '../lib/hooks';
import FS from '../lib/FileSystem';
import Artwork from '../components/Artwork';
import { Serif, Sans } from '../components/Text';
import DownloadablePart from '../components/DownloadablePart';
import { partsReducer, initialPartsState } from './audio-part-state';
import Progress from '../components/Progress';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Audio: React.FC<Props> = ({ route }) => {
  const { audioQuality: quality } = useSettings();
  const audio = route.params.audio;
  const [selectedPart, setSelectedPart] = useState<number>(0);

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
      (progress) => dispatch({ type: `SET_PROGRESS`, idx, progress }),
      (success) =>
        dispatch({ type: `SET_DOWNLOADED`, idx, downloaded: success }),
    );
    dispatch({ type: `SET_DOWNLOADING`, idx, downloading: false });
  };

  const [, Player] = usePlayer();
  const playing = Player.isPlayingAudio(audio.id);

  const allPartsDownloaded = audio.parts.every((p) => FS.hasAudio(p, quality));
  const noPartsDownloaded = !audio.parts.some((p) => FS.hasAudio(p, quality));

  return (
    <ScrollView>
      <View style={tw(`flex-row`)}>
        <Artwork
          id={audio.id}
          url={audio.artwork}
          size={Dimensions.get(`window`).width / 2}
        />
        <View style={tw(`flex-grow p-4 justify-center`)}>
          <TouchableOpacity
            style={tw(`items-center justify-center`)}
            onPress={async () => {
              if (noPartsDownloaded) {
                setSelectedPart(0);
                await downloadPart(audio.parts[0]);
                return Player.playPart(audio.parts[0], quality);
              } else if (playing) {
                return Player.pause();
              } else if (Player.isAudioPartSelected(audio.id, selectedPart)) {
                return Player.resume();
              } else {
                Player.playPart(audio.parts[selectedPart], quality);
              }
            }}>
            <Icon
              size={80}
              color="#6c3142"
              name={playing ? `pause-circle` : `play-circle`}
            />
          </TouchableOpacity>
          <Progress
            playing={playing}
            partDuration={audio.parts[selectedPart].duration}
          />
        </View>
      </View>
      <Serif size={30} style={tw(`text-center p-4`)}>
        {audio.title}
      </Serif>
      {audio.parts.length > 1 && !allPartsDownloaded && (
        <TouchableOpacity
          onPress={() => {
            partsState
              .filter((s) => !s.downloaded && !s.downloading)
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
          playing={idx === selectedPart && playing}
          play={() => {
            setSelectedPart(idx);
            if (Player.isPlayingAudioPart(audio.id, idx)) {
              return;
            } else if (Player.isAudioPartSelected(audio.id, idx)) {
              return Player.resume();
            } else {
              Player.playPart(audio.parts[idx], quality);
            }
          }}
          {...partsState[idx]}
        />
      ))}
    </ScrollView>
  );
};

export default Audio;
