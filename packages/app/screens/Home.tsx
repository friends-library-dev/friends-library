import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import tw from 'tailwind-rn';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../types';
import { Sans } from '../components/Text';
import { useAudios } from '../lib/hooks';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Home: React.FC<Props> = ({ navigation }) => {
  const audios = useAudios();
  return (
    <View style={tw(`flex-grow items-center justify-center`)}>
      <HomeButton
        title={`All Audiobooks (${audios.size})`}
        onPress={() => navigation.navigate(`All Audiobooks`)}
        bgColor="#6c3142"
      />
      <HomeButton
        title="Go to Settings"
        onPress={() => navigation.navigate(`Settings`)}
        bgColor="#999"
      />
    </View>
  );
};

const HomeButton: React.FC<{
  onPress: () => any;
  title: string;
  bgColor: string;
}> = ({ onPress, title, bgColor }) => (
  <TouchableOpacity
    style={{
      ...tw(`self-stretch mx-12 mb-6 px-8 py-4 rounded-full`),
      backgroundColor: bgColor,
    }}
    onPress={onPress}
  >
    <Sans size={20} style={{ ...tw(`text-white text-center`) }}>
      {title}
    </Sans>
  </TouchableOpacity>
);

export default Home;
