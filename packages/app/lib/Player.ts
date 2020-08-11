import { EventEmitter } from 'events';
import RNTrackPlayer from 'react-native-track-player';
import { PlayerState, AudioPart, AudioResource } from '../types';
import { AudioQuality } from '@friends-library/types';
import Data from './Data';
import FS from './FileSystem';

class Player extends EventEmitter {
  private static instance: Player;

  public static defaultState: PlayerState = {
    playing: false,
    playbackState: `NONE`,
  };

  public state: PlayerState = {
    playing: false,
    playbackState: `NONE`,
  };

  public isAudioPartSelected(audioId: string, partIndex: number): boolean {
    return (
      this.isAudioSelected(audioId) && this.state.trackPartIndex === partIndex
    );
  }

  public isAudioSelected(audioId: string): boolean {
    return this.state.trackAudioId === audioId;
  }

  public isPlayingAudio(audioId: string): boolean {
    return (
      this.isAudioSelected(audioId) &&
      ![`STOPPED`, `PAUSED`].includes(this.state.playbackState)
    );
  }

  public isPlayingAudioPart(audioId: string, partIndex: number): boolean {
    return (
      this.isPlayingAudio(audioId) && this.state.trackPartIndex === partIndex
    );
  }

  public resume(): void {
    RNTrackPlayer.play();
  }

  public pause(): void {
    RNTrackPlayer.pause();
  }

  public async playPart(part: AudioPart, quality: AudioQuality): Promise<void> {
    const audio = Data.audioResources.get(part.audioId);
    if (!audio || !FS.hasAudio(part, quality)) {
      return;
    }

    await RNTrackPlayer.stop();
    this.state.trackAudioId = part.audioId;
    this.state.trackPartIndex = part.index;
    this.emit(`state:updated`, this.state);
    RNTrackPlayer.add({
      id: `${part.audioId}--${part.index}`,
      url: FS.audioFile(part, quality),
      title: part.title,
      artist: audio.friend,
      artwork: FS.artworkImageUri(audio.id, audio.artwork),
      pitchAlgorithm: RNTrackPlayer.PITCH_ALGORITHM_VOICE,
    });
    RNTrackPlayer.play();
  }

  public static getInstance(): Player {
    if (!Player.instance) {
      Player.instance = new Player();
      Player.instance.init();
      return Player.instance;
    }

    return Player.instance;
  }

  private init(): void {
    RNTrackPlayer.setupPlayer({
      iosCategoryMode: 'spokenAudio',
    });

    RNTrackPlayer.updateOptions({
      stopWithApp: true,
      capabilities: [
        RNTrackPlayer.CAPABILITY_PLAY,
        RNTrackPlayer.CAPABILITY_PAUSE,
        RNTrackPlayer.CAPABILITY_SEEK_TO,
        RNTrackPlayer.CAPABILITY_STOP,
      ],
    });

    RNTrackPlayer.addEventListener(`playback-state`, data => {
      const playbackState = STATE_MAP[data.state] || `NONE`;
      this.state.playbackState = playbackState;
      this.state.playing = playbackState === `PLAYING`;
      this.emit(`state:updated`, this.state);
    });
  }
}

export default Player;

const STATE_MAP: { [k in string]: PlayerState['playbackState'] } = {
  [RNTrackPlayer.STATE_NONE]: `NONE`,
  [RNTrackPlayer.STATE_READY]: `READY`,
  [RNTrackPlayer.STATE_PLAYING]: `PLAYING`,
  [RNTrackPlayer.STATE_PAUSED]: `PAUSED`,
  [RNTrackPlayer.STATE_STOPPED]: `STOPPED`,
  [RNTrackPlayer.STATE_BUFFERING]: `BUFFERING`,
  buffering: `BUFFERING`,
};
