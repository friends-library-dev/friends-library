import { EventEmitter } from 'events';
import RNTrackPlayer from 'react-native-track-player';
import { PlayerState, AudioPart, AudioResource } from '../types';
import { AudioQuality } from '@friends-library/types';
import Data from './Data';
import FS from './FileSystem';

class Player extends EventEmitter {
  public static DURATION_UNKNOWN = -1;
  private static instance: Player;

  public static defaultState: PlayerState = {
    playing: false,
    playbackState: `NONE`,
  };

  public state: PlayerState = {
    playing: false,
    playbackState: `NONE`,
  };

  public addEventListener(
    event: RNTrackPlayer.EventType,
    listener: (data: any) => void,
  ): RNTrackPlayer.EmitterSubscription {
    return RNTrackPlayer.addEventListener(event, listener);
  }

  public getPosition(): Promise<number> {
    return RNTrackPlayer.getPosition();
  }

  public async seekTo(requestedPosition: number): Promise<void> {
    const { trackAudioId, trackPartIndex } = this.state;
    if (!trackAudioId || trackPartIndex === undefined) {
      return;
    }

    const duration = await this.getCurrentTrackDuration();
    if (duration < 0) {
      return;
    }

    let position = requestedPosition;
    if (position === Player.DURATION_UNKNOWN) {
      position = 0;
    } else if (position > duration) {
      position = duration;
    }

    return RNTrackPlayer.seekTo(position);
  }

  public getPrevAudioPart(): AudioPart | null {
    const audio = this.getCurrentTrackAudioResource();
    if (!audio || this.state.trackPartIndex === undefined) {
      return null;
    }
    return audio.parts[this.state.trackPartIndex - 1] || null;
  }

  public getNextAudioPart(): AudioPart | null {
    const audio = this.getCurrentTrackAudioResource();
    if (!audio || this.state.trackPartIndex === undefined) {
      return null;
    }
    return audio.parts[this.state.trackPartIndex + 1] || null;
  }

  public getCurrentTrackAudioResource(): AudioResource | null {
    return Data.audioResources.get(this.state.trackAudioId || ``) || null;
  }

  public async getCurrentTrackDuration(): Promise<number> {
    const { trackAudioId, trackPartIndex } = this.state;

    let duration = Player.DURATION_UNKNOWN;
    if (!trackAudioId || trackPartIndex === undefined) {
      return duration;
    }

    const audio = this.getCurrentTrackAudioResource();
    if (!audio) {
      duration = Math.floor(await RNTrackPlayer.getDuration());
    } else {
      duration = audio.parts[trackPartIndex].duration;
    }
    return duration;
  }

  public isAudioPartSelected(audioId: string, partIndex: number): boolean {
    return this.isAudioSelected(audioId) && this.state.trackPartIndex === partIndex;
  }

  public clearUpcomingTracks(): void {
    RNTrackPlayer.removeUpcomingTracks();
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
    return this.isPlayingAudio(audioId) && this.state.trackPartIndex === partIndex;
  }

  public reset(): void {
    RNTrackPlayer.reset();
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
      url: FS.audioFile(part),
      title: part.title,
      artist: audio.friend,
      artwork: FS.artworkImageUri(audio.id, audio.artwork),
      pitchAlgorithm: RNTrackPlayer.PITCH_ALGORITHM_VOICE,
      duration: part.duration,
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
      iosCategoryMode: `spokenAudio`,
    });

    RNTrackPlayer.updateOptions({
      stopWithApp: true,
      jumpInterval: 30,
      capabilities: [
        RNTrackPlayer.CAPABILITY_PLAY,
        RNTrackPlayer.CAPABILITY_PAUSE,
        RNTrackPlayer.CAPABILITY_SEEK_TO,
        RNTrackPlayer.CAPABILITY_STOP,
        RNTrackPlayer.CAPABILITY_JUMP_FORWARD,
        RNTrackPlayer.CAPABILITY_JUMP_BACKWARD,
      ],
    });

    RNTrackPlayer.addEventListener(`playback-state`, (data) => {
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
