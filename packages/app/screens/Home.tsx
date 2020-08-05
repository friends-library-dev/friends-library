import React from 'react';
import { View, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../types';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Audio'>;
  route: RouteProp<StackParamList, 'Audio'>;
}

const Home: React.FC<Props> = ({ navigation }) => (
  <View>
    <Button
      onPress={() => navigation.navigate(`All Audiobooks`)}
      title="All Audiobooks"
    />
    <Button
      onPress={() => navigation.navigate(`Settings`)}
      title="Go to Settings"
    />
  </View>
);

export default Home;
