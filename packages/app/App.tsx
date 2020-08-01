import React from 'react';
import { SafeAreaView, Text } from 'react-native';
import * as RNFS from 'react-native-fs';

const App: React.FC = () => {
  return (
    <SafeAreaView>
      <Text>{RNFS.DocumentDirectoryPath}</Text>
    </SafeAreaView>
  );
};

export default App;
