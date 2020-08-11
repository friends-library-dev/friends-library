import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn';
import { AudioPart } from '../types';
import { Sans } from './Text';
import { PartState } from '../screens/audio-part-state';

type Props = {
  part: AudioPart;
  selected: boolean;
  download: () => any;
  play: () => any;
} & PartState;

const DownloadableChapter: React.FC<Props> = ({
  part,
  downloading,
  progress,
  downloaded,
  download,
  play,
  selected,
}) => {
  return (
    <View>
      <View style={tw(`px-4 py-2 flex-row justify-between`)}>
        <Sans>
          {selected ? `• ` : ``}
          {part.title}
        </Sans>
        {downloaded && (
          <TouchableOpacity onPress={play}>
            <Sans>Play</Sans>
          </TouchableOpacity>
        )}
        {!downloaded && !downloading && (
          <TouchableOpacity onPress={download}>
            <Sans>Download</Sans>
          </TouchableOpacity>
        )}
      </View>
      <View
        style={{
          opacity: downloading ? 1 : 0,
          height: 3,
          width: `${progress}%`,
          ...tw(`bg-green-400`),
        }}
      />
    </View>
  );
};

export default DownloadableChapter;
