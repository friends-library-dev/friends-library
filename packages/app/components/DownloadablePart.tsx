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

export const DownloadablePart: React.FC<Props> = (props) => {
  const { part, download, play, state } = props;
  let rightColWidth = 33;
  if (state === `downloading`) {
    rightColWidth = 110;
  } else if (state === `queued_for_download`) {
    rightColWidth = 85;
  } else if (state === `not_downloaded`) {
    rightColWidth = 60;
  }
  return (
    <TouchableOpacity
      style={tw(`border-b border-gray-300`)}
      onPress={state === `downloaded` ? play : undefined}
    >
      <View
        style={tw(`absolute bg-white h-full`, {
          width: props.state === `downloading` ? `${props.progress}%` : `0%`,
        })}
      />
      <View style={tw(`p-2 pl-1 pr-6 flex-row`)}>
        <Icon
          style={{
            ...tw(`mt-1 ml-1 mr-1 text-blue-500`),
            opacity: state === `playing` ? 1 : 0,
          }}
          name="play"
          size={9}
        />
        <Sans size={14} numberOfLines={1} style={{ width: winWidth - rightColWidth }}>
          {part.title}
        </Sans>
        {(state === `queued_for_download` || state === `downloading`) && (
          <Sans size={12} style={tw(`italic text-gray-500 ml-4`)}>
            {state === `downloading` ? state : `queued`}
          </Sans>
        )}
        {state === `not_downloaded` && (
          <TouchableOpacity style={tw(`items-center pl-2`)} onPress={download}>
            <Icon name="cloud-download" size={17} style={tw(`text-gray-500`)} />
          </TouchableOpacity>
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

interface ContainerProps {
  audioId: string;
  partIndex: number;
}

const DownloadablePartContainer: React.FC<ContainerProps> = (ownProps) => {
  const props = useSelector(propSelector(ownProps, useDispatch()));
  if (!props) return null;
  return <DownloadablePart {...props} />;
};

export default DownloadablePartContainer;
