import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn';
import { AudioPart } from '../types';
import { Sans } from './Text';
import { PartState } from '../screens/audio-part-state';

type Props = {
  part: AudioPart;
  download: () => any;
} & PartState;

const DownloadableChapter: React.FC<Props> = ({
  part,
  downloading,
  progress,
  downloaded,
  download,
}) => {
  return (
    <View>
      <View style={tw(`px-4 py-2 flex-row justify-between`)}>
        <Sans>{part.title}</Sans>
        {downloaded && <Sans>Play</Sans>}
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
