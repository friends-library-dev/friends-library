import React from 'react';
import { ScrollView, Dimensions, View } from 'react-native';
import { StackParamList } from '../types';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Serif } from '../components/Text';
import Artwork from '../components/Artwork';
import AudioControls from '../components/AudioControls';
import tw from '../lib/tailwind';
import { useSelector, useDispatch } from '../state';
import { FileState } from '../state/filesystem';
import * as keys from '../lib/keys';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const AudioScreen: React.FC<Props> = ({ route }) => {
  const { audio, playback, partFiles } = useSelector((state) => {
    const resource = state.audioResources[route.params.audioId];
    const parts: FileState[] = [];
    resource.parts.forEach((part) => {
      const path = keys.audioFilePath(resource.id, part.index, `HQ`);
      parts.push(state.filesystem[path]);
    });
    return {
      audio: resource,
      playback: state.playback,
      partFiles: parts,
    };
  });

  const audioSelected = audio.id === playback.audioId;
  const playingThisAudio = audioSelected && playback.state === 'PLAYING';
  const activePart = audioSelected && playback.partIndex ? playback.partIndex : 0;
  const activePartFile = partFiles[activePart];

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
          downloading={
            activePartFile.bytesOnDisk > 0 &&
            activePartFile.bytesOnDisk < activePartFile.totalBytes
          }
          progress={(activePartFile.totalBytes / activePartFile.bytesOnDisk) * 100}
          togglePlayback={() => {}}
          seekForward={() => {}}
          seekBackward={() => {}}
          position={playingThisAudio ? playback.position : null}
        />
      </View>
    </ScrollView>
  );
};

export default AudioScreen;

const ARTWORK_WIDTH = Dimensions.get(`window`).width * 0.8;
