import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from '../lib/tailwind';
import { useSelector, useDispatch, State, Dispatch } from '../state';
import { isDownloading, isDownloaded, downloadProgress } from '../state/filesystem';
import { AudioPart } from '../types';
import { Sans } from './Text';
import { isAudioPartPlaying, audioPartFile } from '../state/selectors';

interface ContainerProps {
  audioId: string;
  partIndex: number;
}

type Props = {
  part: AudioPart;
  download: () => any;
  play: () => any;
  playing: boolean;
  downloading: boolean;
  progress: number;
  downloaded: boolean;
  queued: boolean;
};

const winWidth = Dimensions.get(`window`).width;
const RIGHT_COL_WIDTH = 75;

const DownloadablePart: React.FC<Props> = ({
  part,
  downloading,
  progress,
  downloaded,
  download,
  play,
  playing,
  queued,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!downloaded) return;
        play();
      }}
    >
      <View
        style={tw(`pr-0 pl-2 py-2 flex-row border-b border-gray-300 justify-between`)}
      >
        <View style={tw(`flex-row`, { width: winWidth - RIGHT_COL_WIDTH })}>
          <Icon
            style={tw(`mx-1 pt-1 text-blue-500`, {
              opacity: playing ? 1 : 0,
            })}
            name="play"
            size={9}
          />
          <Sans style={tw(`flex-grow`)} size={14}>
            {part.title}
            {queued ? ` (queued)` : ``}
          </Sans>
        </View>
        {!downloaded && !downloading && (
          <TouchableOpacity
            style={tw(`items-center pl-2`, { width: RIGHT_COL_WIDTH })}
            onPress={download}
          >
            <Icon name="cloud-download" size={17} style={tw(`text-gray-500`)} />
          </TouchableOpacity>
        )}
      </View>
      <View
        style={tw(`bg-green-400`, {
          opacity: downloading ? 1 : 0,
          height: 3,
          width: `${progress}%`,
          ...tw(`bg-green-400`),
        })}
      />
    </TouchableOpacity>
  );
};

export const propSelector: (
  ownProps: ContainerProps,
  dispatch: Dispatch,
) => (state: State) => null | Props = ({ audioId, partIndex }) => {
  return (state) => {
    const audio = state.audioResources[audioId];
    if (!audio) return null;
    const part = audio.parts[partIndex];
    if (!part) return null;
    const file = audioPartFile(audioId, partIndex, state);
    return {
      play: () => {},
      download: () => {},
      playing: isAudioPartPlaying(audioId, partIndex, state),
      part,
      downloaded: isDownloaded(file),
      downloading: isDownloading(file),
      progress: downloadProgress(file),
      queued: file.queued === true,
    };
  };
};

const DownloadablePartContainer: React.FC<ContainerProps> = (ownProps) => {
  const props = useSelector(propSelector(ownProps, useDispatch()));
  if (!props) return null;
  return <DownloadablePart {...props} />;
};

export default DownloadablePartContainer;
