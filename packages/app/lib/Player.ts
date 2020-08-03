import RNTrackPlayer from 'react-native-track-player';

class Player {
  private static instance: Player;

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
  }
}

export default Player;
