import { CommandBuilder } from 'yargs';

export const command = 'soundcloud';

export const describe = 'do soundcloud things';

export const builder: CommandBuilder = function(yargs) {
  return yargs
    .option('all', {
      alias: 'a',
      type: 'boolean',
      description: 'do everything: set all options to `true`',
      default: false,
      demand: false,
    })
    .option('limit', {
      type: 'number',
      alias: 'l',
      description: 'limit the number of audio resources operated upon',
      default: 999999,
      demand: false,
    })
    .option('verify-external-tracks', {
      type: 'boolean',
      description: 'verify existence of soundcloud tracks from .yml data',
      default: false,
      demand: false,
    })
    .option('create-missing-playlists', {
      type: 'boolean',
      description: 'create external playlists if missing',
      default: false,
      demand: false,
    })
    .option('verify-local-filepaths', {
      type: 'boolean',
      description: 'verify existence of local mp3 files in ~/Sync',
      default: false,
      demand: false,
    })
    .option('upload-mp3s', {
      type: 'boolean',
      description: 'upload local mp3s to cloud location',
      default: false,
      demand: false,
    })
    .option('set-track-attrs', {
      type: 'boolean',
      description: 'set track attributes',
      default: false,
      demand: false,
    })
    .option('set-track-artwork', {
      type: 'boolean',
      description: 'upload artwork image for each track',
      default: false,
      demand: false,
    })
    .option('set-playlist-artwork', {
      type: 'boolean',
      description: 'upload artwork image for playlists',
      default: false,
      demand: false,
    });
};

export { default as handler } from './handler';
