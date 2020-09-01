import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '../types';
import Home from '../screens/Home';
import AllAudios from '../screens/AllAudios';
import Audio from '../screens/Audio';
import Settings from '../screens/Settings';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="All Audiobooks" component={AllAudios} />
        <Stack.Screen name="Audio" component={Audio} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
