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
import { shortTitle } from '../lib/utils';
import { useSelector, useDispatch } from '../state';
import { isDownloading, isDownloaded, downloadAllAudios } from '../state/filesystem';
import * as select from '../state/selectors';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const AudioScreen: React.FC<Props> = ({ route }) => {
  const dispatch = useDispatch();
  const selection = useSelector((state) => {
    const audioPart = select.activeAudioPart(route.params.audioId, state);
    const files = select.audioFiles(route.params.audioId, state);
    if (!audioPart || !files) return null;
    const [part, audio] = audioPart;
    const activeFile = select.audioPartFile(audio.id, part.index, state);
    return {
      audio,
      downloadingActivePart: isDownloading(activeFile),
      activePartIndex: part.index,
      showDownloadAll:
        files.filter((p) => !isDownloading(p) && !isDownloaded(p)).length > 0,
    };
  });

  if (!selection) return null;
  const { audio, showDownloadAll, activePartIndex, downloadingActivePart } = selection;
  const isMultipart = audio.parts.length > 1;

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
        <AudioControls audioId={audio.id} />
        {isMultipart && !downloadingActivePart && (
          <View style={tw(`flex-row justify-center -mt-4`)}>
            <Sans size={13} style={tw(`text-gray-600`)}>
              Part {activePartIndex + 1} of {audio.parts.length}
            </Sans>
          </View>
        )}
      </View>
      <Serif size={30} style={tw(`text-center py-4 px-8`)}>
        {shortTitle(audio.title)}
      </Serif>
      {!audio.title.includes(audio.friend) && !audio.friend.startsWith(`Compila`) && (
        <Serif size={22} style={tw(`text-center italic text-gray-700 mb-6 -mt-2`)}>
          by {audio.friend}
        </Serif>
      )}
      {showDownloadAll && (
        <View style={tw(`pb-2 px-4 flex-row justify-center`)}>
          <TouchableOpacity
            onPress={() => dispatch(downloadAllAudios(audio.id))}
            style={tw(`bg-blue-200 flex-row px-6 py-2 rounded-full`)}
          >
            <Icon name="cloud-download" size={21} style={tw(`pr-2 text-blue-800`)} />
            <Sans size={15} style={tw(`text-blue-800`)}>
              Download {isMultipart ? `all` : ``}
            </Sans>
          </TouchableOpacity>
        </View>
      )}
      <Serif
        style={tw(`px-6 pt-2 pb-4 text-justify text-gray-800`, {
          lineHeight: 26,
        })}
        size={18}
      >
        {audio.shortDescription}
      </Serif>
      {isMultipart &&
        audio.parts.map((part) => (
          <DownloadablePart
            key={`${audio.id}--${part.index}`}
            audioId={audio.id}
            partIndex={part.index}
          />
        ))}
    </ScrollView>
  );
};

export default AudioScreen;

const ARTWORK_WIDTH = Dimensions.get(`window`).width * 0.8;
