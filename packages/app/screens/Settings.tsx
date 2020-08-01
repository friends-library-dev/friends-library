import React, { useState } from 'react';
import { View, Switch, Button, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import tw from 'tailwind-rn';
import { useSettings } from '../lib/hooks';
import { StackParamList } from '../types';
import Data from '../lib/Data';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Settings'>;
  route: RouteProp<StackParamList, 'Settings'>;
}

const Home: React.FC<Props> = ({ navigation }) => {
  const settings = useSettings();
  const [enabled, setEnabled] = useState<boolean>(settings.audioQuality === `HQ`);

  return (
    <View>
      <Button onPress={() => navigation.navigate(`Home`)} title="Go Home" />
      <View style={tw(`flex-row justify-between p-3`)}>
        <Text style={{ fontSize: 18 }}>Hi quality audio</Text>
        <Switch
          trackColor={{ false: `#767577`, true: `#81b0ff` }}
          thumbColor={enabled ? `#f5dd4b` : `#f4f3f4`}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => {
            Data.setAudioQualityPreference(enabled ? `LQ` : `HQ`);
            setEnabled(!enabled);
          }}
          value={enabled}
        />
      </View>
    </View>
  );
};

export default Home;
