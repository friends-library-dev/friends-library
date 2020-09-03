import React from 'react';
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import tw from '../lib/tailwind';
import { shortTitle } from '../lib/utils';
import { Sans, Serif } from './Text';
import Artwork from './Artwork';

interface Props {
  id: string;
  title: string;
  friend: string;
  progress: number;
}

const AudioListItem: React.FC<Props> = ({ id, title, friend, progress }) => {
  return (
    <View style={tw(`flex-row p-2 border-b border-gray-500`)}>
      <View style={tw({ width: 90, height: 90 })}>
        <Artwork id={id} size={90} />
        {progress > 4 && progress < 96 && <ProgressBar progress={progress} />}
        {progress >= 96 && <Complete />}
      </View>
      <View style={tw(`flex-col m-2 flex-shrink`)}>
        <Serif size={22} style={tw(`pb-1`)} numberOfLines={2}>
          {shortTitle(title)}
        </Serif>
        {!friend.startsWith(`Compila`) && <Sans size={16}>{friend}</Sans>}
      </View>
    </View>
  );
};

export default AudioListItem;

const ProgressBar: React.FC<{ progress: number }> = ({ progress }) => (
  <View style={tw(`absolute bottom-0 rounded-full m-2`, { width: 75, height: 4 })}>
    <View
      style={tw(`absolute bg-white bottom-0 rounded-full w-full h-full`, {
        opacity: 0.4,
      })}
    />
    <View
      style={tw(`absolute bg-white bottom-0 rounded-full h-full`, {
        width: (progress / 100) * 75,
        opacity: 0.8,
      })}
    />
  </View>
);

const Complete: React.FC = () => (
  <View style={tw(`absolute right-0 top-0 m-1`, { opacity: 85 })}>
    <Icon name="check-circle" color="white" size={15} />
  </View>
);
