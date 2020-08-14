import React, { useReducer, useEffect, useState } from 'react';
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
import AudioControls from '../components/AudioControls';
import { AudioQuality } from '@friends-library/types';

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

  useEffect(() => {
    FS.setOnlyListener(`download:start`, (part: AudioPart, dlQuality: AudioQuality) => {
      if (part.audioId != audio.id || quality !== dlQuality) return;
      dispatch({ type: `SET_DOWNLOADING`, idx: part.index, downloading: true });
    });
    FS.setOnlyListener(
      `download:progress`,
      (progress: number, part: AudioPart, dlQuality: AudioQuality) => {
        if (part.audioId != audio.id || quality !== dlQuality) return;
        dispatch({ type: `SET_PROGRESS`, idx: part.index, progress });
      },
    );
    FS.setOnlyListener(`download:failed`, (part: AudioPart, dlQuality: AudioQuality) => {
      if (part.audioId != audio.id || quality !== dlQuality) return;
      dispatch({ type: `SET_DOWNLOADING`, idx: part.index, downloading: false });
      dispatch({ type: `SET_DOWNLOADED`, idx: part.index, downloaded: false });
    });
    FS.setOnlyListener(
      `download:complete`,
      (part: AudioPart, dlQuality: AudioQuality) => {
        if (part.audioId != audio.id || quality !== dlQuality) return;
        dispatch({ type: `SET_DOWNLOADED`, idx: part.index, downloaded: true });
        dispatch({ type: `SET_DOWNLOADING`, idx: part.index, downloading: false });
      },
    );
    return () => {
      FS.removeAllListeners(`download:start`);
      FS.removeAllListeners(`download:complete`);
      FS.removeAllListeners(`download:failed`);
      FS.removeAllListeners(`download:progress`);
    };
  }, []);

  const downloadPart: (part: AudioPart) => Promise<void> = async (part) => {
    const idx = part.index;
    dispatch({ type: `SET_DOWNLOADING`, idx, downloading: true });
    await FS.downloadAudio(
      part,
      quality,
      (progress) => dispatch({ type: `SET_PROGRESS`, idx, progress }),
      (success) => dispatch({ type: `SET_DOWNLOADED`, idx, downloaded: success }),
    );
    dispatch({ type: `SET_DOWNLOADING`, idx, downloading: false });
  };

  async function skipTo(index: number): Promise<void> {
    Player.reset();
    setSelectedPart(index);
    if (!FS.hasAudio(audio.parts[index], quality)) {
      await downloadPart(audio.parts[index]);
    }
    return Player.playPart(audio.parts[index], quality);
  }

  const [, Player] = usePlayer();
  const playing = Player.isPlayingAudio(audio.id);

  const partDownloading = partsState.some((p) => p.downloading);
  const noPartsDownloaded = !audio.parts.some((p) => FS.hasAudio(p, quality));
  const showDownloadAll =
    partsState.filter((p) => !p.downloaded && !p.downloading).length > 0;

  return (
    <ScrollView style={tw(``)}>
      <Artwork
        id={audio.id}
        url={audio.artwork}
        size={Dimensions.get(`window`).width * 0.8}
        style={{
          marginTop: `8%`,
          alignSelf: `center`,
          elevation: 2,
          shadowColor: `#000`,
          shadowOffset: { width: 3, height: 3 },
          shadowOpacity: 0.5,
          shadowRadius: 5,
        }}
      />
      <View style={tw(`flex-grow py-4 px-8 justify-center`)}>
        <AudioControls
          playing={playing}
          duration={audio.parts[selectedPart].duration}
          numParts={audio.parts.length}
          isCurrentAudioPart={Player.isAudioPartSelected(audio.id, selectedPart)}
          downloading={partsState[selectedPart].downloading}
          progress={partsState[selectedPart].progress}
          skipNext={
            audio.parts[selectedPart + 1] !== undefined
              ? () => skipTo(selectedPart + 1)
              : undefined
          }
          skipBack={
            audio.parts[selectedPart - 1] !== undefined
              ? () => skipTo(selectedPart - 1)
              : undefined
          }
          togglePlayback={async () => {
            if (noPartsDownloaded) {
              Player.reset();
              setSelectedPart(0);
              await downloadPart(audio.parts[0]);
              return Player.playPart(audio.parts[0], quality);
            } else if (playing) {
              return Player.pause();
            } else if (Player.isAudioPartSelected(audio.id, selectedPart)) {
              return Player.resume();
            } else {
              Player.reset();
              Player.playPart(audio.parts[selectedPart], quality);
            }
          }}
        />
      </View>
      <Serif size={30} style={tw(`text-center p-4`)}>
        {audio.title}
      </Serif>
      {showDownloadAll && (
        <TouchableOpacity
          style={tw(`pb-2 px-4 flex-row justify-center`)}
          onPress={() => {
            partsState.forEach((part, idx) => {
              if (!part.downloaded && !part.downloading) {
                downloadPart(audio.parts[idx]);
              }
            });
          }}
        >
          <View style={tw(`bg-blue-200 flex-row px-6 py-2 rounded-full`)}>
            <Icon name="cloud-download" size={21} style={tw(`pr-2 text-blue-800`)} />
            <Sans size={15} style={tw(`text-blue-800`)}>
              Download {audio.parts.length > 1 ? `all` : ``}
            </Sans>
          </View>
        </TouchableOpacity>
      )}
      <Serif
        style={{
          ...tw(`px-6 pt-2 pb-4 text-justify text-gray-800`),
          lineHeight: 26,
        }}
        size={18}
      >
        {audio.shortDescription}
      </Serif>
      {audio.parts.length > 1 &&
        audio.parts.map((part, idx) => (
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
