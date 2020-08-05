import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import tw from 'tailwind-rn';
import { AudioPart } from '../types';
import { Sans } from './Text';
import FS from '../lib/FileSystem';
import { useSettings } from '../lib/hooks';

interface Props {
  part: AudioPart;
}

const DownloadableChapter: React.FC<Props> = ({ part }) => {
  const { audioQuality: quality } = useSettings();
  const [progress, setProgress] = useState<number>(0);
  const [downloading, setDownloading] = useState<boolean>(false);
  const [downloaded, setDownloaded] = useState<boolean>(
    FS.hasAudio(part, quality),
  );

  return (
    <View style={tw(`px-4 py-3 flex-row justify-between`)}>
      <Sans>{part.title}</Sans>
      {downloading && <Sans>{progress}</Sans>}
      {downloaded && <Sans>DOWNLOADED!</Sans>}
      {!downloaded && !downloading && (
        <TouchableOpacity
          onPress={async () => {
            setDownloading(true);
            await FS.downloadAudio(part, quality, setProgress, setDownloaded);
            setDownloading(false);
          }}>
          <Sans>Download</Sans>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default DownloadableChapter;
