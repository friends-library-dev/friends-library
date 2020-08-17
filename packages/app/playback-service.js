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
    const { playbackState, trackPartIndex } = player.state;
    const quality = Data.userSettings.audioQuality;
    const audio = player.getCurrentTrackAudioResource();

    if (playbackState === `PLAYING`) {
      if (!audio) return;

      Data.setLastPlayedAudio(audio.id);
      if (trackPartIndex !== undefined) {
        Data.setLastPlayedPart(audio.id, trackPartIndex);
      }

      if (audio.parts.length === 1) {
        player.clearUpcomingTracks();
      }

      const position = await player.getPosition();
      const duration = await player.getCurrentTrackDuration();
      const nextAudioPart = player.getNextAudioPart();

      if (nextAudioPart && !FS.hasAudio(nextAudioPart, quality)) {
        if (position / duration > 0.75) {
          FS.downloadAudio(nextAudioPart, quality);
        }
      }

      if (duration - position < 10 && trackPartIndex !== undefined) {
        Data.clearLastPlayedPart(audio.id);
        Data.clearPartPosition(audio.id, trackPartIndex);
      } else if (trackPartIndex !== undefined) {
        Data.setPartPosition(audio.id, trackPartIndex, position);
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
