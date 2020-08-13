import React from 'react';
import { View } from 'react-native';
import tw from 'tailwind-rn';
import TrackPlayer from 'react-native-track-player';
import { Sans } from './Text';

interface Props {
  playing: boolean;
  downloading: boolean;
  downloadingProgress: number;
  partDuration: number;
}

export default class Progress extends TrackPlayer.ProgressComponent<Props> {
  render() {
    const { position } = this.state;
    const {
      partDuration,
      playing,
      downloading,
      downloadingProgress,
    } = this.props;
    return (
      <View style={{ opacity: playing || downloading ? 1 : 0.6 }}>
        <View style={tw(`mt-6 h-2`)}>
          <View
            style={tw(`w-full border-b border-2 border-gray-300 absolute`)}
          />
          <View
            style={{
              ...tw(`border-b border-2 border-gray-500 absolute`),
              width: `${
                downloading
                  ? downloadingProgress
                  : (position / partDuration) * 100
              }%`,
            }}
          />
          {!downloading && (
            <View
              style={{
                ...tw(`rounded-full absolute bg-gray-500`),
                width: 9,
                height: 9,
                marginTop: -2.5,
                left: `${(position / partDuration) * 100}%`,
              }}
            />
          )}
        </View>
        {!downloading && (
          <View style={tw(`flex-row justify-between`)}>
            <Sans size={13}>{formatTime(this.state.position)}</Sans>
            <Sans size={13}>{formatTime(partDuration)}</Sans>
          </View>
        )}
        {downloading && (
          <View style={tw(`flex-row justify-center`)}>
            <Sans size={13}>Downloading...</Sans>
          </View>
        )}
      </View>
    );
  }
}

function formatTime(totalSeconds: number): string {
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
