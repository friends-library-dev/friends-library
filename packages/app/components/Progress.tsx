import React from 'react';
import { View } from 'react-native';
import Scrubber from 'react-native-scrubber';
import tw from 'tailwind-rn';
import TrackPlayer from 'react-native-track-player';
import Player from '../lib/Player';
import { Sans } from './Text';
import { HEX_MAROON } from '../lib/constants';

interface Props {
  playing: boolean;
  downloading: boolean;
  downloadingProgress: number;
  partDuration: number;
  inUse: boolean;
}

export default class Progress extends TrackPlayer.ProgressComponent<Props> {
  public render(): JSX.Element {
    const { position } = this.state;
    const { partDuration, playing, downloading, downloadingProgress, inUse } = this.props;
    return (
      <View style={{ opacity: playing || downloading ? 1 : 0.6 }}>
        {!downloading && (
          <Scrubber
            value={inUse ? position : 0}
            bufferedValue={0}
            scrubbedColor={HEX_MAROON}
            totalDuration={partDuration}
            onSlidingComplete={(position) => {
              if (!inUse) return;
              this.setState({ position });
              Player.getInstance().seekTo(position);
            }}
          />
        )}
        {downloading && (
          <>
            <View style={tw(`mt-3 h-2`)}>
              <View style={tw(`w-full border-b border-2 border-gray-300 absolute`)} />
              <View
                style={{
                  ...tw(`border-b border-2 border-gray-500 absolute`),
                  width: `${downloadingProgress}%`,
                }}
              />
            </View>
            <View style={tw(`flex-row justify-center`)}>
              <Sans size={13}>Downloading...</Sans>
            </View>
          </>
        )}
      </View>
    );
  }
}

export function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / (60 * 60));
  const minutes = Math.floor((totalSeconds - hours * 60 * 60) / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return [hours, minutes, seconds]
    .map(String)
    .map((part) => part.padStart(2, `0`))
    .join(`:`)
    .replace(/^00:(\d\d:\d\d)/, `$1`)
    .replace(/^0(\d:\d\d)/, `$1`);
}
