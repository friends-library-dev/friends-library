import Player from './lib/player';
import { setCurrentTrackPosition } from './state/track-position';
import { maybeDownloadNextQueuedTrack } from './state/filesystem';
import { maybeAdvanceQueue } from './state/active-part';
import { setState as setPlaybackState } from './state/playback';

module.exports = async function () {
  Player.addEventListener(`remote-play`, () => {
    Player.resume();
    Player.dispatch(setPlaybackState(`PLAYING`));
  });

  Player.addEventListener(`remote-pause`, () => {
    Player.pause();
    Player.dispatch(setPlaybackState(`PAUSED`));
  });

  Player.addEventListener(`remote-stop`, () => {
    Player.pause();
    Player.dispatch(setPlaybackState(`PAUSED`));
  });

  Player.addEventListener(`remote-jump-forward`, () => Player.seekRelative(30));
  Player.addEventListener(`remote-jump-backward`, () => Player.seekRelative(-30));
  Player.addEventListener(`remote-seek`, ({ position }) => Player.seekTo(position));

  Player.addEventListener(`remote-duck`, ({ paused }) => {
    if (paused) {
      Player.pause();
      Player.dispatch(setPlaybackState(`PAUSED`));
    } else {
      Player.resume();
      Player.dispatch(setPlaybackState(`PLAYING`));
    }
  });

  Player.addEventListener(
    `playback-track-changed`,
    ({ nextTrack }: { nextTrack: null | string }) => {
      if (nextTrack) {
        Player.dispatch(maybeAdvanceQueue(nextTrack));
      }
    },
  );

  let counter = 0;
  setInterval(async () => {
    counter++;
    const [position, state] = await Promise.all([
      Player.getPosition(),
      Player.getState(),
    ]);
    if (state !== `PLAYING`) {
      return;
    }
    Player.dispatch(setCurrentTrackPosition(position));
    if (counter % 5 === 0) {
      Player.dispatch(maybeDownloadNextQueuedTrack(position));
    }
  }, 1000);

  const events = [
    `playback-state`,
    `playback-track-changed`,
    `playback-error`,
    `remote-pause`,
    `remote-play`,
    `remote-stop`,
    `remote-next`,
    `remote-previous`,
    `remote-seek`,
    `remote-duck`,
    `remote-jump-forward`,
    `remote-jump-backward`,
    `playback-track-changed`,
    `playback-queue-ended`,
  ];

  const debugEvents = false;
  for (const event of events) {
    if (debugEvents) {
      // @ts-ignore
      Player.addEventListener(event, (...args) => console.log(event, args));
    }
  }
};
