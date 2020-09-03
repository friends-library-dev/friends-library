import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from '../lib/tailwind';
import { useSelector, useDispatch, State, Dispatch } from '../state';
import {
  isDownloading,
  isDownloaded,
  downloadProgress,
  downloadAudio,
} from '../state/filesystem';
import { togglePartPlayback } from '../state/playback';
import { AudioPart } from '../types';
import { Sans } from './Text';
import { isAudioPartPlaying, audioPartFile } from '../state/selectors';

interface ContainerProps {
  audioId: string;
  partIndex: number;
}

type CommonProps = {
  part: Pick<AudioPart, 'title'>;
  download: () => any;
  play: () => any;
};

type PartState =
  | 'downloading'
  | 'downloaded'
  | 'queued_for_download'
  | 'playing'
  | 'not_downloaded';

type Props =
  | (CommonProps & { state: Exclude<PartState, 'downloading'> })
  | (CommonProps & { state: 'downloading'; progress: number });

const winWidth = Dimensions.get(`window`).width;
const RIGHT_COL_WIDTH = 75;

export const DownloadablePart: React.FC<Props> = (props) => {
  const { part, download, play, state } = props;
  return (
    <TouchableOpacity onPress={state === `downloaded` ? play : undefined}>
      <View style={tw(`h-10 flex-row border-b border-gray-300 justify-between`)}>
        <View
          style={tw(`absolute bg-blue-100 self-stretch`, {
            width: props.state === `downloading` ? `${props.progress}%` : '0%',
            height: 39,
          })}
        />
        <View>
          <View
            style={tw(`absolute ml-2 flex-row`, {
              width: winWidth - RIGHT_COL_WIDTH,
              marginTop: 11,
            })}
          >
            <Icon
              style={tw(`mx-1 pt-1 pr-px text-blue-500`, {
                opacity: state === `playing` ? 1 : 0,
              })}
              name="play"
              size={9}
            />
            <View style={tw(`flex-grow flex-row`)}>
              <Sans style={tw(``)} size={14} numberOfLines={1}>
                {part.title}
              </Sans>
            </View>
          </View>
        </View>
        {state === `not_downloaded` && (
          <TouchableOpacity
            style={tw(`items-center pl-2`, { width: RIGHT_COL_WIDTH, marginTop: 13 })}
            onPress={download}
          >
            <Icon name="cloud-download" size={17} style={tw(`text-gray-500`)} />
          </TouchableOpacity>
        )}
        {state === `queued_for_download` && (
          <Sans style={tw(`italic p-3 text-gray-500`)} size={14}>
            downloading
          </Sans>
        )}
        {state === `queued_for_download` && (
          <Sans style={tw(`italic pl-3 text-gray-500`)} size={14}>
            queued
          </Sans>
        )}
      </View>
    </TouchableOpacity>
  );
};

export const propSelector: (
  ownProps: ContainerProps,
  dispatch: Dispatch,
) => (state: State) => null | Props = ({ audioId, partIndex }, dispatch) => {
  return (state) => {
    const audio = state.audioResources[audioId];
    if (!audio) return null;
    const part = audio.parts[partIndex];
    if (!part) return null;
    const file = audioPartFile(audioId, partIndex, state);
    const common = {
      play: () => dispatch(togglePartPlayback(audioId, partIndex)),
      download: () => dispatch(downloadAudio(audioId, partIndex)),
      part,
    };
    if (isDownloading(file)) {
      return { ...common, state: `downloading`, progress: downloadProgress(file) };
    }

    if (isAudioPartPlaying(audioId, partIndex, state)) {
      return { ...common, state: `playing` };
    }

    if (isDownloaded(file)) {
      return { ...common, state: `downloaded` };
    }
    if (file.queued === true) {
      return { ...common, state: `queued_for_download` };
    }
    return { ...common, state: `not_downloaded` };
  };
};

const DownloadablePartContainer: React.FC<ContainerProps> = (ownProps) => {
  const props = useSelector(propSelector(ownProps, useDispatch()));
  if (!props) return null;
  return <DownloadablePart {...props} />;
};

export default DownloadablePartContainer;
