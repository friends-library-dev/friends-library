import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Progress from './Progress';
import { HEX_BLUE } from '../lib/constants';
import tw from '../lib/tailwind';
import { usePlayer } from '../lib/hooks';

interface Props {
  skipNext?: () => any;
  skipBack?: () => any;
  togglePlayback: () => any;
  playing: boolean;
  duration: number;
  numParts: number;
  downloading: boolean;
  progress: number;
  isCurrentAudioPart: boolean;
}

const AudioControls: React.FC<Props> = ({
  playing,
  togglePlayback,
  duration,
  downloading,
  progress,
  isCurrentAudioPart,
  skipBack,
  skipNext,
}) => {
  const [, player] = usePlayer();
  return (
    <>
      <View style={tw(`flex-row items-center px-2`, downloading ? `justify-center` : `justify-between`)}>
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
          <TouchableOpacity onPress={() => player.seekBackward(30)}>
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
          <TouchableOpacity onPress={() => player.seekForward(30)}>
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
      <Progress
        downloading={downloading}
        downloadingProgress={progress}
        playing={playing}
        partDuration={duration}
        inUse={isCurrentAudioPart}
      />
    </>
  );
};

export default AudioControls;
