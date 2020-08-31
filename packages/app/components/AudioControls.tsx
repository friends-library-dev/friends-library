import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Scrubber from './Scrubber';
import { HEX_BLUE } from '../lib/constants';
import tw from '../lib/tailwind';
import { PropSelector, State, Dispatch, useSelector, useDispatch } from '../state';
import * as select from '../state/selectors';
import { togglePlayback } from '../state/playback';
import { downloadProgress, isDownloading } from '../state/filesystem';
import { seekRelative } from '../state/track-position';

interface Props {
  skipNext?: () => any;
  skipBack?: () => any;
  seekForward: () => any;
  seekBackward: () => any;
  togglePlayback: () => any;
  playing: boolean;
  duration: number;
  numParts: number;
  downloading: boolean;
  progress: number;
  position: number | null;
}

const AudioControls: React.FC<Props> = ({
  playing,
  togglePlayback,
  duration,
  downloading,
  progress,
  seekForward,
  seekBackward,
  skipBack,
  skipNext,
  position,
}) => {
  return (
    <>
      <View
        style={tw(
          `flex-row items-center px-2`,
          downloading ? `justify-center` : `justify-between`,
        )}
      >
        {!downloading && (
          <TouchableOpacity onPress={skipBack}>
            <Icon
              style={{ opacity: skipBack ? 1 : 0 }}
              name="step-backward"
              size={25}
              color={HEX_BLUE}
            />
          </TouchableOpacity>
        )}
        {!downloading && (
          <TouchableOpacity onPress={seekBackward}>
            <Icon
              style={{ transform: [{ scaleX: -1 }] }}
              name="repeat"
              size={25}
              color={HEX_BLUE}
            />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={tw(`items-center justify-center mb-2`)}
          onPress={togglePlayback}
        >
          <Icon
            size={80}
            color={HEX_BLUE}
            style={{ opacity: downloading ? 0.5 : 1 }}
            name={
              downloading ? `cloud-download` : playing ? `pause-circle` : `play-circle`
            }
          />
        </TouchableOpacity>
        {!downloading && (
          <TouchableOpacity onPress={seekForward}>
            <Icon name="repeat" size={25} color={HEX_BLUE} />
          </TouchableOpacity>
        )}
        {!downloading && (
          <TouchableOpacity onPress={skipNext}>
            <Icon
              style={{ opacity: skipNext ? 1 : 0 }}
              name="step-forward"
              size={25}
              color={HEX_BLUE}
            />
          </TouchableOpacity>
        )}
      </View>
      <Scrubber
        downloading={downloading}
        downloadingProgress={progress}
        playing={playing}
        partDuration={duration}
        position={position}
        seekTo={() => {}}
      />
    </>
  );
};

interface OwnProps {
  audioId: string;
}

export const propSelector: PropSelector<OwnProps, Props> = ({ audioId }, dispatch) => {
  return (state) => {
    const activePart = select.activeAudioPart(audioId, state);
    if (!activePart) return null;
    const [part, audio] = activePart;
    const file = select.audioPartFile(audioId, part.index, state);
    const audioSelected = select.isAudioSelected(audioId, state);
    return {
      playing: select.isAudioPlaying(audioId, state),
      duration: part.duration,
      numParts: audio.parts.length,
      progress: downloadProgress(file),
      downloading: isDownloading(file),
      position: audioSelected ? select.trackPosition(audioId, part.index, state) : null,
      togglePlayback: () => dispatch(togglePlayback(audioId)),
      seekForward: () => dispatch(seekRelative(audioId, part.index, 30)),
      seekBackward: () => dispatch(seekRelative(audioId, part.index, -30)),
    };
  };
};

const AudioControlsContainer: React.FC<OwnProps> = (ownProps) => {
  const props = useSelector(propSelector(ownProps, useDispatch()));
  if (!props) return null;
  return <AudioControls {...props} />;
};

export default AudioControlsContainer;
