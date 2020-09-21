import React, { useEffect } from 'react';
import NetInfo from '@react-native-community/netinfo';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StackParamList } from '../types';
import Home from '../screens/Home';
import AllAudios from '../screens/AllAudios';
import Audio from '../screens/Audio';
import Settings from '../screens/Settings';
import { useDispatch } from '../state';
import { setConnected } from '../state/network';

const Stack = createStackNavigator<StackParamList>();

const App: React.FC = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    return NetInfo.addEventListener((state) => {
      dispatch(setConnected(state.isConnected));
    });
  }, [dispatch]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="Audiobooks" component={AllAudios} />
        <Stack.Screen name="Listen" component={Audio} />
        <Stack.Screen name="Settings" component={Settings} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
