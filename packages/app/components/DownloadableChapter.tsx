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
    <View>
      <View style={tw(`px-4 py-2 flex-row justify-between`)}>
        <Sans>{part.title}</Sans>
        {downloaded && <Sans>Play</Sans>}
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
      <View
        style={{
          opacity: downloading ? 1 : 0,
          height: 3,
          width: `${progress}%`,
          ...tw(`bg-green-400`),
        }}
      />
    </View>
  );
};

export default DownloadableChapter;
