import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from 'tailwind-rn';
import { AudioPart } from '../types';
import { Sans } from './Text';
import { PartState } from '../screens/audio-part-state';

type Props = {
  part: AudioPart;
  download: () => any;
  play: () => any;
  playing: boolean;
} & PartState;

const DownloadableChapter: React.FC<Props> = ({
  part,
  downloading,
  progress,
  downloaded,
  download,
  play,
  playing,
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        if (!downloaded) return;
        play();
      }}>
      <View style={tw(`pr-4 pl-2 py-2 flex-row border-b border-gray-300`)}>
        <Icon
          style={{
            ...tw(`mx-1 pt-1 text-blue-500`),
            opacity: playing ? 1 : 0,
          }}
          name="play"
          size={9}
        />
        <Sans style={tw(`flex-grow`)} size={14}>
          {part.title}
        </Sans>
        {!downloaded && !downloading && (
          <TouchableOpacity style={tw(``)} onPress={download}>
            <Icon name="cloud-download" size={17} style={tw(`text-gray-500`)} />
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
    </TouchableOpacity>
  );
};

export default DownloadableChapter;
