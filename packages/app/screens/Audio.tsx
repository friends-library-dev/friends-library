import React from 'react';
import { ScrollView, Dimensions, View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StackParamList } from '../types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Serif, Sans } from '../components/Text';
import Artwork from '../components/Artwork';
import AudioControls from '../components/AudioControls';
import DownloadablePart from '../components/DownloadablePart';
import tw from '../lib/tailwind';
import { useSelector, useDispatch } from '../state';
import { togglePlayback } from '../state/playback';
import {
  FileState,
  isDownloading,
  isDownloaded,
  downloadProgress,
} from '../state/filesystem';
import * as keys from '../lib/keys';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const AudioScreen: React.FC<Props> = ({ route }) => {
  const dispatch = useDispatch();
  const { audio, playback, partFiles } = useSelector((state) => {
    const quality = state.preferences.audioQuality;
    const resource = state.audioResources[route.params.audioId];
    const parts: FileState[] = [];
    (resource || { parts: [] }).parts.forEach((part) => {
      const path = keys.audioFilePath(resource.id, part.index, quality);
      if (path in state.filesystem) {
        parts.push(state.filesystem[path]);
      }
    });
    return {
      audio: resource,
      playback: state.playback,
      partFiles: parts,
    };
  });

  if (!audio) return null;

  const audioSelected = audio.id === playback.audioId;
  const playingThisAudio = audioSelected && playback.state === 'PLAYING';
  const activePart = audioSelected && playback.partIndex ? playback.partIndex : 0;
  const activePartFile = partFiles[activePart];
  const showDownloadAll =
    partFiles.filter((p) => !isDownloading(p) && !isDownloaded(p)).length > 0;

  if (!activePartFile) return null;

  return (
    <ScrollView>
      <Artwork
        id={audio.id}
        size={ARTWORK_WIDTH}
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
          playing={playingThisAudio}
          duration={audio.parts[activePart].duration}
          numParts={audio.parts.length}
          downloading={isDownloading(activePartFile)}
          progress={downloadProgress(activePartFile)}
          togglePlayback={() => dispatch(togglePlayback(audio.id))}
          seekForward={() => {}}
          seekBackward={() => {}}
          position={playingThisAudio ? playback.position : null}
        />
      </View>
      <Serif size={30} style={tw(`text-center p-4`)}>
        {audio.title}
      </Serif>
      {showDownloadAll && (
        <TouchableOpacity
          style={tw(`pb-2 px-4 flex-row justify-center`)}
          onPress={() => {}}
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
        style={tw(`px-6 pt-2 pb-4 text-justify text-gray-800`, {
          lineHeight: 26,
        })}
        size={18}
      >
        {audio.shortDescription}
      </Serif>
      {audio.parts.length > 1 &&
        audio.parts.map((part, idx) => (
          <DownloadablePart
            key={`${audio.id}--${part.index}`}
            download={() => {}}
            part={part}
            playing={idx === activePart && playingThisAudio}
            play={() => {}}
            downloading={isDownloading(partFiles[idx])}
            progress={downloadProgress(partFiles[idx])}
            downloaded={isDownloaded(partFiles[idx])}
          />
        ))}
    </ScrollView>
  );
};

export default AudioScreen;

const ARTWORK_WIDTH = Dimensions.get(`window`).width * 0.8;
