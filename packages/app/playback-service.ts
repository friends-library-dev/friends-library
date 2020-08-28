import Player from './lib/player';
import { setPosition } from './state/playback';

module.exports = async function () {
  Player.addEventListener(`remote-pause`, () => Player.pause());
  Player.addEventListener(`remote-play`, () => Player.resume());

  Player.addEventListener(`remote-jump-forward`, ({ interval }) => {
    // Player.seekForward(interval);
  });

  Player.addEventListener(`remote-jump-backward`, ({ interval }) => {
    // Player.seekBackward(interval);
  });

  Player.addEventListener(`remote-seek`, async ({ position }) => {
    // Player.seekTo(position);
  });

  setInterval(async () => {
    const [position, state] = await Promise.all([
      Player.getPosition(),
      Player.getState(),
    ]);
    if (state === `PLAYING`) {
      Player.dispatch(setPosition(position));
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
    Player.addEventListener(event, (...args) => console.log(event, args));
  }
};
