// @ts-check
const Player = require('./lib/Player').default;
const Data = require('./lib/Data').default;
const FS = require('./lib/FileSystem').default;

module.exports = async function () {
  const player = Player.getInstance();
  player.addEventListener(`remote-pause`, () => player.pause());
  player.addEventListener(`remote-play`, () => player.resume());

  player.addEventListener(`remote-jump-forward`, ({ interval }) => {
    player.seekForward(interval);
  });

  player.addEventListener(`remote-jump-backward`, ({ interval }) => {
    player.seekBackward(interval);
  });

  player.addEventListener(`remote-seek`, async ({ position }) => {
    player.seekTo(position);
  });

  setInterval(async () => {
    const { playbackState } = player.state;
    const quality = Data.userSettings.audioQuality;

    // download next chapter after 75% of current played
    if (playbackState === `PLAYING`) {
      const audio = player.getCurrentTrackAudioResource();
      if (!audio) return;
      if (audio.parts.length === 1) {
        player.clearUpcomingTracks();
        return;
      }

      const nextAudioPart = player.getNextAudioPart();
      if (!nextAudioPart || FS.hasAudio(nextAudioPart, quality)) {
        return;
      }

      const position = await player.getPosition();
      const duration = await player.getCurrentTrackDuration();
      if (position / duration > 0.75) {
        FS.downloadAudio(nextAudioPart, quality);
      }
    }
  }, BACKGROUND_JOBS_TICK_RATE);

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
    // player.addEventListener(event, (...args) => console.log(event, args));
  }
};

const BACKGROUND_JOBS_TICK_RATE = 5000;
