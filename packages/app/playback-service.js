const TrackPlayer = require('react-native-track-player');

module.exports = async function () {
  TrackPlayer.addEventListener(`remote-pause`, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(`remote-play`, () => TrackPlayer.play());

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
    TrackPlayer.addEventListener(event, (...args) => console.log(event, args));
  }
};
