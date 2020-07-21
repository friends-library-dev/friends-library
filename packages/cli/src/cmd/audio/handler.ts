import fs from 'fs-extra';
import path from 'path';
import { execSync } from 'child_process';
import uuid from 'uuid/v4';
import env from '@friends-library/env';
import * as cloud from '@friends-library/cloud';
import { c, log, red, green, yellow } from '@friends-library/cli-utils/color';
import { getAllFriends, Audio, Friend } from '@friends-library/friends';
import * as docMeta from '@friends-library/document-meta';
import { isDefined, AudioQuality } from '@friends-library/types';
import Client from './SoundCloudClient';

interface Argv {
  all: boolean;
  lang: 'en' | 'es' | 'both';
  limit: number;
  verifyLocalFilepaths: boolean;
  uploadMp3Files: boolean;
  uploadMp3Zips: boolean;
  uploadM4BFiles: boolean;
  setTrackAttrs: boolean;
  setTrackArtwork: boolean;
  setPlaylistArtwork: boolean;
  verifyExternalTracks: boolean;
  uploadExternalTracks: boolean;
  createMissingPlaylists: boolean;
  recreateIndividualTitip: boolean;
  storeFilesizes: boolean;
  pattern?: string;
}

export default async function handler(argv: Argv): Promise<void> {
  let friends: Friend[] = [];
  if (argv.lang === `both` || argv.lang === `en`) {
    friends = friends.concat(getAllFriends(`en`, true));
  }
  if (argv.lang === `both` || argv.lang === `es`) {
    friends = friends.concat(getAllFriends(`es`, true));
  }

  const audios = friends
    .filter(friend => friend.documents.some(doc => doc.hasAudio))
    .flatMap(friend => friend.documents)
    .flatMap(document => document.editions)
    .filter(edition => !edition.isDraft)
    .map(edition => edition.audio)
    .filter(isDefined);

  for (const audio of audios.slice(0, argv.limit)) {
    await handleAudio(audio, argv);
  }
}

async function handleAudio(audio: Audio, argv: Argv): Promise<void> {
  const client = getClient();
  const edition = audio.edition;
  if (argv.pattern && !edition.path.includes(argv.pattern)) {
    return;
  }

  log(c`🎤  Handling audio: {magenta ${edition.path}}`);

  let paths: string[] = [];
  if (shouldVerifyAudioPaths(argv)) {
    paths = verifyAudioPaths(audio);
  }

  if (argv.all || argv.storeFilesizes) {
    const meta = await docMeta.fetchSingleton();
    storeFilesizes(audio, paths, meta);
    await docMeta.save(meta);
  }

  if (argv.all || argv.uploadMp3Files) {
    await uploadLocalAudioFilesToCloud(paths, isMp3);
  }

  if (argv.all || argv.uploadM4BFiles) {
    await uploadLocalAudioFilesToCloud(paths, isM4b);
  }

  if (argv.all || argv.uploadMp3Zips) {
    await zipAndUploadMp3s(audio, paths.filter(isMp3));
  }

  const tmpDir = `/tmp/${uuid()}`;
  let artworkPath = ``;
  if (needArtwork(argv)) {
    fs.mkdirpSync(tmpDir);
    artworkPath = `${tmpDir}/artwork.png`;
    const buffer = await cloud.downloadFile(audio.imagePath);
    fs.writeFileSync(artworkPath, buffer);
  }

  if (argv.all || argv.uploadExternalTracks) {
    await uploadExternalTracks(audio, paths, artworkPath);
  }

  if (argv.all || argv.verifyExternalTracks) {
    await verifyTracksExist(audio);
  }

  if (argv.all || argv.setTrackAttrs) {
    for (const part of audio.parts) {
      const attrs = {
        sharing: `public`,
        embeddable_by: `all`,
        track_type: `spoken`,
        commentable: false,
        downloadable: true,
        label_name: `Friends Library Publishing`,
      };
      await client.updateTrackAttrs(part.externalIdHq, attrs);
      await client.updateTrackAttrs(part.externalIdLq, attrs);
    }
  }

  if (argv.all || argv.setTrackArtwork) {
    for (const part of audio.parts) {
      await client.setTrackArtwork(part.externalIdHq, artworkPath);
      await client.setTrackArtwork(part.externalIdLq, artworkPath);
    }
  }

  if ((argv.all || argv.createMissingPlaylists) && audio.parts.length > 1) {
    if (!audio.externalPlaylistIdHq) {
      await createMissingPlaylist(audio, `HQ`);
    }
    if (!audio.externalPlaylistIdLq) {
      await createMissingPlaylist(audio, `LQ`);
    }
  }

  if ((argv.all || argv.setPlaylistArtwork) && audio.parts.length > 1) {
    await client.setPlaylistArtwork(audio.externalPlaylistIdHq || 0, artworkPath);
    await client.setPlaylistArtwork(audio.externalPlaylistIdLq || 0, artworkPath);
  }

  if (argv.recreateIndividualTitip) {
    await recreateIndividualTitip(audio, artworkPath);
  }

  if (needArtwork(argv)) {
    fs.removeSync(tmpDir);
  }
}

async function uploadLocalAudioFilesToCloud(
  paths: string[],
  filter: (str: string) => boolean,
): Promise<void> {
  for (const path of paths.filter(filter)) {
    const cloudPath = path.replace(/^.+?\/(en|es)\//, `$1/`);
    green(`uploading ${filter === isMp3 ? `mp3` : `m4b`} file: ${cloudPath}`);
    await cloud.uploadFile(path, cloudPath);
  }
}

async function zipAndUploadMp3s(audio: Audio, paths: string[]): Promise<void> {
  const { zipFilenameHq, zipFilenameLq } = audio;
  const hqPaths = paths.filter(p => !p.endsWith(`--lq.mp3`));
  const lqPaths = paths.filter(p => p.endsWith(`--lq.mp3`));
  const dir = path.dirname(paths[0]);
  const opts = { cwd: dir };
  execSync(`zip ${zipFilenameLq} ${lqPaths.map(p => path.basename(p)).join(` `)}`, opts);
  execSync(`zip ${zipFilenameHq} ${hqPaths.map(p => path.basename(p)).join(` `)}`, opts);
  await cloud.uploadFile(`${dir}/${zipFilenameLq}`, audio.zipFilepathLq);
  await cloud.uploadFile(`${dir}/${zipFilenameHq}`, audio.zipFilepathHq);
}

async function createMissingPlaylist(audio: Audio, quality: 'HQ' | 'LQ'): Promise<void> {
  const edition = audio.edition;
  const document = edition.document;
  const playlistId = await getClient().createPlaylist({
    title: document.title,
    description: edition.description || document.description,
    tags: [quality as string].concat(document.tags),
    tracks: audio.parts.map(p => (quality === `HQ` ? p.externalIdHq : p.externalIdLq)),
  });
  const key = `external_playlist_id_${quality.toLowerCase()}`;
  red(`SET in .yml: ${edition.path}/audio ${key}: ${playlistId}`);
  process.exit(1);
}

async function verifyTracksExist(audio: Audio): Promise<void> {
  for (const part of audio.parts) {
    const trackHq = await getClient().getTrack(part.externalIdHq);
    if (trackHq === null || trackHq.user.permalink !== `msf-audio`) {
      throw new Error(`HQ track not found for ${audio.edition.path} ${part.title}`);
    }
    green(`sc track: ${trackHq.id} for ${audio.edition.path} ${part.title} HQ`);
    const trackLq = await getClient().getTrack(part.externalIdLq);
    if (trackLq === null || trackHq.user.permalink !== `msf-audio`) {
      throw new Error(`LQ track not found for ${audio.edition.path} ${part.title}`);
    }
    green(`sc track: ${trackLq.id} for ${audio.edition.path} ${part.title} LQ`);
  }
}

function verifyAudioPaths(audio: Audio): string[] {
  const syncPath = `/Users/jared/Sync`;
  let paths = [
    `${syncPath}/${audio.audiobookFilepath(`HQ`)}`,
    `${syncPath}/${audio.audiobookFilepath(`LQ`)}`,
  ];

  paths = paths.concat(
    audio.parts.flatMap((part, idx) => {
      return [
        `${syncPath}/${audio.partFilepath(idx, `HQ`)}`,
        `${syncPath}/${audio.partFilepath(idx, `LQ`)}`,
      ];
    }),
  );

  let fileMissing = false;
  paths.forEach(path => {
    if (!fs.existsSync(path)) {
      fileMissing = true;
      red(`404 file: ${path}`);
    }
  });

  if (fileMissing) process.exit(1);

  return paths;
}

/**
 * The audio files for the individual TITIP files were created for embedding on
 * the MSF site, and so their titles indicated that they were individual chapters
 * of the TITIP book. This was jarring when these audios were embedded as standalone
 * files for the "journal selection" item for the individual friend. This function
 * just finds those files, and creates copies in soundcloud with a correct title.
 */
async function recreateIndividualTitip(audio: Audio, artworkPath: string): Promise<void> {
  if (audio.parts.length > 1 || audio.edition.document.isCompilation) {
    return;
  }

  const track = await getClient().getTrack(audio.parts[0].externalIdLq);
  if (track && track.title.toLowerCase().includes(`truth in the inward parts`)) {
    const [hqPath, lqPath] = verifyAudioPaths(audio);
    const lqTrackId = await uploadIndividualTitip(audio, lqPath, artworkPath, `LQ`);
    red(`set ${audio.edition.path} external_id_lq: ${lqTrackId}`);
    const hqTrackId = await uploadIndividualTitip(audio, hqPath, artworkPath, `HQ`);
    red(`set ${audio.edition.path} external_id_hq: ${hqTrackId}`);
  }
}

async function uploadIndividualTitip(
  audio: Audio,
  path: string,
  artworkPath: string,
  quality: 'HQ' | 'LQ',
): Promise<number> {
  yellow(`start upload of ${audio.edition.path}`);
  const trackId = await getClient().uploadTrack({
    title: audio.edition.document.title,
    description: audio.edition.description || audio.edition.document.description,
    audioPath: path,
    imagePath: artworkPath,
    tags: [quality as string].concat(audio.edition.document.tags),
  });
  green(`complete upload of ${audio.edition.path}`);
  return trackId;
}

async function uploadExternalTracks(
  audio: Audio,
  paths: string[],
  artworkPath: string,
): Promise<void> {
  for (let i = 0; i < audio.parts.length; i++) {
    const part = audio.parts[i];
    const qualities: AudioQuality[] = [`LQ`, `HQ`];
    for (const quality of qualities) {
      const key = quality === `HQ` ? `externalIdHq` : `externalIdLq`;
      if (part[key] === 0) {
        const trackId = await getClient().uploadTrack({
          title: audio.edition.document.title,
          description: audio.edition.description || audio.edition.document.description,
          audioPath: paths.find(p => p.endsWith(audio.partFilename(i, quality))) || ``,
          imagePath: artworkPath,
          tags: [quality as string].concat(audio.edition.document.tags),
        });
        red(`${key} ${quality} for ${audio.edition.path}:${i} ${part.title}: ${trackId}`);
      }
    }
  }
}

async function storeFilesizes(
  audio: Audio,
  paths: string[],
  meta: docMeta.DocumentMeta,
): Promise<void> {
  const dir = path.dirname(paths[0]);
  const editionMeta = meta.get(audio.edition.path);
  if (!editionMeta) throw new Error(`Edition meta not found: ${audio.edition.path}`);
  meta.set(audio.edition.path, {
    ...editionMeta,
    updated: new Date().toISOString(),
    audioFilesizes: {
      m4bHq: fs.statSync(`${dir}/${audio.m4bFilenameHq}`)[`size`],
      m4bLq: fs.statSync(`${dir}/${audio.m4bFilenameLq}`)[`size`],
      mp3ZipHq: fs.statSync(`${dir}/${audio.zipFilenameHq}`)[`size`],
      mp3ZipLq: fs.statSync(`${dir}/${audio.zipFilenameLq}`)[`size`],
    },
  });
}

function isM4b(path: string): boolean {
  return path.endsWith(`.m4b`);
}

function isMp3(path: string): boolean {
  return path.endsWith(`.mp3`);
}

function needArtwork(argv: Argv): boolean {
  return (
    argv.all ||
    argv.setPlaylistArtwork ||
    argv.uploadExternalTracks ||
    argv.setTrackArtwork ||
    argv.recreateIndividualTitip
  );
}

function shouldVerifyAudioPaths(argv: Argv): boolean {
  return (
    argv.all ||
    argv.verifyLocalFilepaths ||
    argv.uploadExternalTracks ||
    argv.uploadM4BFiles ||
    argv.uploadMp3Files ||
    argv.uploadMp3Zips ||
    argv.storeFilesizes
  );
}

let client: Client | undefined;

function getClient(): Client {
  if (client) {
    return client;
  }
  const {
    SOUNDCLOUD_USERNAME,
    SOUNDCLOUD_PASSWORD,
    SOUNDCLOUD_CLIENT_ID,
    SOUNDCLOUD_CLIENT_SECRET,
  } = env.require(
    `SOUNDCLOUD_USERNAME`,
    `SOUNDCLOUD_PASSWORD`,
    `SOUNDCLOUD_CLIENT_ID`,
    `SOUNDCLOUD_CLIENT_SECRET`,
  );

  client = new Client({
    username: SOUNDCLOUD_USERNAME,
    password: SOUNDCLOUD_PASSWORD,
    clientId: SOUNDCLOUD_CLIENT_ID,
    clientSecret: SOUNDCLOUD_CLIENT_SECRET,
  });

  return client;
}
