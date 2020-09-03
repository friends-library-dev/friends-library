import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Scrubber from './Scrubber';
import { HEX_BLUE } from '../lib/constants';
import tw from '../lib/tailwind';
import { PropSelector, useSelector, useDispatch } from '../state';
import * as select from '../state/selectors';
import { togglePlayback, skipNext, skipBack } from '../state/playback';
import { downloadProgress, isDownloading } from '../state/filesystem';
import { seekRelative, seekTo } from '../state/track-position';

interface Props {
  skipNext?: () => any;
  skipBack?: () => any;
  seekForward: () => any;
  seekBackward: () => any;
  togglePlayback: () => any;
  seekTo: (position: number) => any;
  playing: boolean;
  duration: number;
  downloading: boolean;
  progress: number;
  position: number | null;
  multipart: boolean;
}

export const AudioControls: React.FC<Props> = ({
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
  seekTo,
  multipart,
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
              style={{ opacity: multipart ? (skipBack ? 1 : 0.2) : 0 }}
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
              style={{ opacity: multipart ? (skipNext ? 1 : 0.2) : 0 }}
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
        seekTo={seekTo}
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
    const multipart = audio.parts.length > 1;
    const canSkipNext = multipart && part.index < audio.parts.length - 1;
    const canSkipBack = multipart && part.index > 0;
    return {
      multipart,
      skipNext: canSkipNext ? () => dispatch(skipNext()) : undefined,
      skipBack: canSkipBack ? () => dispatch(skipBack()) : undefined,
      playing: select.isAudioPlaying(audioId, state),
      duration: part.duration,
      numParts: audio.parts.length,
      progress: downloadProgress(file),
      downloading: isDownloading(file),
      position: select.trackPosition(audioId, part.index, state),
      togglePlayback: () => dispatch(togglePlayback(audioId)),
      seekForward: () => dispatch(seekRelative(audioId, part.index, 30)),
      seekBackward: () => dispatch(seekRelative(audioId, part.index, -30)),
      seekTo: (position: number) => dispatch(seekTo(audioId, part.index, position)),
    };
  };
};

const AudioControlsContainer: React.FC<OwnProps> = (ownProps) => {
  const props = useSelector(propSelector(ownProps, useDispatch()));
  if (!props) return null;
  return <AudioControls {...props} />;
};

export default AudioControlsContainer;
