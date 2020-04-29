import { CommandBuilder } from 'yargs';

export const command = 'audio';

export const describe = 'handle audio-related tasks';

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
    .option('pattern', {
      type: 'string',
      alias: 'p',
      describe: 'pattern to match audio paths',
      demand: false,
    })
    .option('lang', {
      type: 'string',
      describe: 'which languages',
      choices: ['en', 'es', 'both'],
      default: 'both',
      demand: false,
    })
    .option('verify-external-tracks', {
      type: 'boolean',
      description: 'verify existence of soundcloud tracks from .yml data',
      default: false,
      demand: false,
    })
    .option('upload-external-tracks', {
      type: 'boolean',
      description: 'upload any missing external tracks designated with id=0',
      default: false,
      demand: false,
    })
    .option('recreate-individual-titip', {
      type: 'boolean',
      description: 'create duplicates of TITIP chapter files for standalone embedding',
      default: false,
      demand: false,
    })
    .option('create-missing-playlists', {
      type: 'boolean',
      description: 'create soundcloud playlists if missing',
      default: false,
      demand: false,
    })
    .option('verify-local-filepaths', {
      type: 'boolean',
      description: 'verify existence of local mp3 files in ~/Sync',
      default: false,
      demand: false,
    })
    .option('store-filesizes', {
      type: 'boolean',
      description: 'store audio filesize data in document meta',
      default: false,
      demand: false,
    })
    .option('upload-mp3-zips', {
      type: 'boolean',
      description: 'upload local mp3s as aggregate zip files to cloud location',
      default: false,
      demand: false,
    })
    .option('upload-mp3-files', {
      type: 'boolean',
      description: 'upload local mp3s to cloud location',
      default: false,
      demand: false,
    })
    .option('upload-m4b-files', {
      type: 'boolean',
      description: 'upload local m4b files to cloud location',
      default: false,
      demand: false,
    })
    .option('set-track-attrs', {
      type: 'boolean',
      description: 'set soundcloud track attributes',
      default: false,
      demand: false,
    })
    .option('set-track-artwork', {
      type: 'boolean',
      description: 'upload soundcloud artwork image for each track',
      default: false,
      demand: false,
    })
    .option('set-playlist-artwork', {
      type: 'boolean',
      description: 'upload soundcloud artwork image for playlists',
      default: false,
      demand: false,
    });
};

export { default as handler } from './handler';
