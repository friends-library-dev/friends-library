import { EventEmitter } from 'events';
import RNTrackPlayer from 'react-native-track-player';
import { TrackData } from '../types';
import { Dispatch } from '../state';

class Player extends EventEmitter {
  public dispatch: Dispatch = (): any => {};

  public resume(): void {
    RNTrackPlayer.play();
  }

  public pause(): void {
    RNTrackPlayer.pause();
  }

  public getPosition(): Promise<number> {
    return RNTrackPlayer.getPosition();
  }

  public seekTo(position: number): Promise<void> {
    return RNTrackPlayer.seekTo(position);
  }

  public async seekRelative(delta: number): Promise<void> {
    const currentPosition = await RNTrackPlayer.getPosition();
    this.seekTo(currentPosition + delta);
  }

  public async getState(): Promise<'PLAYING' | 'PAUSED' | 'STOPPED'> {
    const RNState = await RNTrackPlayer.getState();
    switch (RNState) {
      case RNTrackPlayer.STATE_PLAYING:
      case RNTrackPlayer.STATE_BUFFERING:
        return `PLAYING`;
      case RNTrackPlayer.STATE_PAUSED:
        return `PAUSED`;
      default:
        return `STOPPED`;
    }
  }

  public async playPart(track: TrackData): Promise<void> {
    await RNTrackPlayer.stop();
    RNTrackPlayer.add({
      id: track.id,
      url: track.filepath,
      title: track.title,
      artist: track.artist,
      artwork: track.artworkUrl,
      duration: track.duration,
      pitchAlgorithm: RNTrackPlayer.PITCH_ALGORITHM_VOICE,
    });
    return RNTrackPlayer.play();
  }

  public init(): void {
    RNTrackPlayer.setupPlayer({
      iosCategoryMode: `spokenAudio`,
    });

    RNTrackPlayer.updateOptions({
      stopWithApp: false,
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
  }

  public addEventListener(
    event: RNTrackPlayer.EventType,
    listener: (data: any) => void,
  ): RNTrackPlayer.EmitterSubscription {
    return RNTrackPlayer.addEventListener(event, listener);
  }
}

export default new Player();
