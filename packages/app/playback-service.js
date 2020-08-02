const TrackPlayer = require('react-native-track-player');

module.exports = async function () {
  TrackPlayer.addEventListener(`playback-state`, (...args) =>
    console.log(`playback-state`, args),
  );
  TrackPlayer.addEventListener(`playback-track-changed`, (...args) =>
    console.log(`playback-state`, args),
  );
  TrackPlayer.addEventListener(`playback-error`, (...args) =>
    console.log(`playback-state`, args),
  );

  TrackPlayer.addEventListener(`remote-pause`, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(`remote-play`, () => TrackPlayer.play());

  const events = [
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
