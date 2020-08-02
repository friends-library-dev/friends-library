import React, { useState, useEffect } from 'react';
import { SafeAreaView, TouchableOpacity, Text } from 'react-native';
import TrackPlayer from 'react-native-track-player';
import * as fs from 'react-native-fs';

const MP3 = `https://flp-assets.nyc3.digitaloceanspaces.com/en/elizabeth-webb/letter/updated/Letter_of_Elizabeth_Webb--lq.mp3`;
const LOCAL = `${fs.DocumentDirectoryPath}/webb.mp3`;

const App: React.FC = () => {
  const [downloaded, setDownloaded] = useState<boolean>(false);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [playing, setPlaying] = useState<boolean>(false);

  useEffect(() => {
    fs.exists(LOCAL).then((exists) => {
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
      {downloaded && !playing && (
        <TouchableOpacity
          onPress={() => {
            setPlaying(true);
            TrackPlayer.add({
              id: 'lol',
              url: `file://${LOCAL}`,
              title: 'letter',
              album: 'Friends Library',
              artist: 'Elizabeth Webb',
              genre: 'Spoken',
              date: '2020-05-20T07:00:00+00:00',
              artwork:
                'https://flp-assets.nyc3.digitaloceanspaces.com/en/elizabeth-webb/letter/updated/Letter_of_Elizabeth_Webb--updated--audio.png',
            });
            TrackPlayer.play();
          }}>
          <Text>Play webb</Text>
        </TouchableOpacity>
      )}
      {playing && (
        <TouchableOpacity
          onPress={() => {
            setPlaying(false);
            TrackPlayer.stop();
          }}>
          <Text>STOP</Text>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
};

export default App;
