import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Text } from 'react-native';
import * as fs from 'react-native-fs';

const MP3 = `https://flp-assets.nyc3.digitaloceanspaces.com/en/elizabeth-webb/letter/updated/Letter_of_Elizabeth_Webb--lq.mp3`;
const LOCAL = `${fs.DocumentDirectoryPath}/webb.mp3`;

const App: React.FC = () => {
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);

  useEffect(() => {
    console.log('effect');
    fs.exists(LOCAL).then((exists) => {
      console.log({ exists });
      if (exists) setDownloaded(true);
    });
  }, []);

  return (
    <SafeAreaView style={{ margin: 100 }}>
      {!downloaded && !downloading && (
        <TouchableOpacity
          onPress={async () => {
            setDownloading(true);
            const dl = fs.downloadFile({ fromUrl: MP3, toFile: LOCAL });
            const result = await dl.promise;
            setDownloading(false);
            setDownloaded(true);
          }}>
          <Text>Download File</Text>
        </TouchableOpacity>
      )}
      {downloading && <Text>Downloading...</Text>}
      {downloaded && (
        <TouchableOpacity>
          <Text>Play webb</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default App;
