import React, { useState } from 'react';
import filesize from 'filesize';
import { View, Switch, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import tw from '../lib/tailwind';
import { useSettings } from '../lib/hooks';
import { StackParamList } from '../types';
import { Sans } from '../components/Text';
import Data from '../lib/Data';
import FS from '../lib/FileSystem';

const humansize = filesize.partial({ round: 0, spacer: `` });

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Settings'>;
  route: RouteProp<StackParamList, 'Settings'>;
}

const Home: React.FC<Props> = () => {
  const settings = useSettings();
  const [enabled, setEnabled] = useState(settings.audioQuality === `HQ`);
  const [storageCleared, setStorageCleared] = useState(false);
  const deletable = FS.getDeletableBytes();

  return (
    <View>
      <View
        style={tw(`flex-row justify-between p-4 border-b border-gray-400 items-center`)}
      >
        <Sans size={18}>Hi quality audio</Sans>
        <Switch
          trackColor={{ false: `#767577`, true: `#ddd` }}
          thumbColor={enabled ? `green` : `#f4f3f4`}
          ios_backgroundColor="#777"
          onValueChange={() => {
            Data.setAudioQualityPreference(enabled ? `LQ` : `HQ`);
            setEnabled(!enabled);
          }}
          value={enabled}
        />
      </View>
      <View
        style={tw(`flex-row justify-between p-4 border-b border-gray-400 items-center`)}
      >
        <Sans size={18}>
          Downloaded audio: {humansize(storageCleared ? 0 : deletable)}
        </Sans>
        <TouchableOpacity
          onPress={() => {
            setStorageCleared(true);
            FS.deleteAllDeletable();
          }}
        >
          <Sans size={18} style={tw(`text-red-600`)}>
            {storageCleared || deletable === 0 ? `` : `Delete`}
          </Sans>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Home;
