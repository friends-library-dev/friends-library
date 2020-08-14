import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import Progress from './Progress';
import { HEX_BLUE } from '../lib/constants';
import tw from '../lib/tailwind';

interface Props {
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
}) => {
  return (
    <>
      <TouchableOpacity
        style={tw(`items-center justify-center mb-2`)}
        onPress={togglePlayback}
      >
        <Icon
          size={80}
          color={HEX_BLUE}
          style={{ opacity: downloading ? 0.5 : 1 }}
          name={downloading ? `cloud-download` : playing ? `pause-circle` : `play-circle`}
        />
      </TouchableOpacity>
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
