// @ts-check
const Player = require('./lib/Player').default;

module.exports = async function () {
  const player = Player.getInstance();
  player.addEventListener(`remote-pause`, () => player.pause());
  player.addEventListener(`remote-play`, () => player.resume());

  player.addEventListener(`remote-jump-forward`, async ({ interval }) => {
    const currentPosition = await player.getPosition();
    player.seekTo(currentPosition + interval);
  });

  player.addEventListener(`remote-jump-backward`, async ({ interval }) => {
    const currentPosition = await player.getPosition();
    player.seekTo(currentPosition - interval);
  });

  player.addEventListener(`remote-seek`, async ({ position }) => {
    player.seekTo(position);
  });

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
    player.addEventListener(event, (...args) => console.log(event, args));
  }
};
