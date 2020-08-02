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
};
