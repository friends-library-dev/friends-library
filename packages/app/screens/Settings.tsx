import React from 'react';
import filesize from 'filesize';
import { View, Switch, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import tw from '../lib/tailwind';
import { StackParamList } from '../types';
import { Sans } from '../components/Text';
import { useDispatch, useSelector } from '../state/';
import { toggleQuality } from '../state/preferences';
import { deleteAllAudios } from '../state/filesystem';

const humansize = filesize.partial({ round: 0, spacer: `` });

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Settings'>;
  route: RouteProp<StackParamList, 'Settings'>;
}

const Home: React.FC<Props> = () => {
  const dispatch = useDispatch();
  const { quality, deletableBytes } = useSelector((state) => ({
    quality: state.preferences.audioQuality,
    deletableBytes: Object.keys(state.filesystem).reduce((acc, path) => {
      return path.endsWith(`.mp3`)
        ? acc + (state.filesystem[path] || { bytesOnDisk: 0 }).bytesOnDisk
        : acc;
    }, 0),
  }));
  const hqEnabled = quality === `HQ`;

  return (
    <View>
      <View
        style={tw(`flex-row justify-between p-4 border-b border-gray-400 items-center`)}
      >
        <Sans size={18}>Hi quality audio</Sans>
        <Switch
          trackColor={{ false: `#767577`, true: `#ddd` }}
          thumbColor={hqEnabled ? `green` : `#f4f3f4`}
          ios_backgroundColor="#777"
          onValueChange={() => dispatch(toggleQuality())}
          value={hqEnabled}
        />
      </View>
      <View
        style={tw(`flex-row justify-between p-4 border-b border-gray-400 items-center`)}
      >
        <Sans size={18}>Downloaded audio: {humansize(deletableBytes)}</Sans>
        <TouchableOpacity onPress={() => dispatch(deleteAllAudios())}>
          <Sans size={18} style={tw(`text-red-600`)}>
            {deletableBytes === 0 ? `` : `Delete`}
          </Sans>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
