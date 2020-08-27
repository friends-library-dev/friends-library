import { EventEmitter } from 'events';
import RNTrackPlayer from 'react-native-track-player';

class Player extends EventEmitter {
  public resume(): void {
    RNTrackPlayer.play();
  }

  public pause(): void {
    RNTrackPlayer.pause();
  }

  public init(): void {
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
  }

  public addEventListener(
    event: RNTrackPlayer.EventType,
    listener: (data: any) => void,
  ): RNTrackPlayer.EmitterSubscription {
    return RNTrackPlayer.addEventListener(event, listener);
  }
}

export default new Player();
