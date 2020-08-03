import React from 'react';
import { View, Text, Button } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { StackParamList } from '../types';

interface Props {
  navigation: StackNavigationProp<StackParamList, 'Settings'>;
  route: RouteProp<StackParamList, 'Settings'>;
}

const Home: React.FC<Props> = ({ navigation }) => (
  <View>
    <Button onPress={() => navigation.navigate(`Home`)} title="Go Home" />
  </View>
);

export default Home;
