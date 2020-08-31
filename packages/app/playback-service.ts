import Player from './lib/player';
import { setCurrentTrackPosition } from './state/track-position';

module.exports = async function () {
  Player.addEventListener(`remote-play`, () => Player.resume());
  Player.addEventListener(`remote-pause`, () => Player.pause());

  Player.addEventListener(`remote-jump-forward`, () => Player.seekRelative(30));
  Player.addEventListener(`remote-jump-backward`, () => Player.seekRelative(-30));
  Player.addEventListener(`remote-seek`, ({ position }) => Player.seekTo(position));

  setInterval(async () => {
    const [position, state] = await Promise.all([
      Player.getPosition(),
      Player.getState(),
    ]);
    if (state === `PLAYING`) {
      Player.dispatch(setCurrentTrackPosition(position));
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

  for (const event of events) {
    // @ts-ignore
    // Player.addEventListener(event, (...args) => console.log(event, args));
  }
};
