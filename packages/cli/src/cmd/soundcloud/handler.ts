import fs from 'fs-extra';
import uuid from 'uuid/v4';
import env from '@friends-library/env';
import * as cloud from '@friends-library/cloud';
import { red, green } from '@friends-library/cli-utils/color';
import { getAllFriends, Audio } from '@friends-library/friends';
import { isDefined } from '@friends-library/types';
import Client from './SoundCloudClient';

interface Argv {
  all: boolean;
  limit: number;
  verifyLocalFilepaths: boolean;
  uploadMp3s: boolean;
  setTrackAttrs: boolean;
  setTrackArtwork: boolean;
  setPlaylistArtwork: boolean;
  verifyExternalTracks: boolean;
  createMissingPlaylists: boolean;
}

export default async function handler(argv: Argv): Promise<void> {
  const audios = getAllFriends('en', true)
    .filter(friend => friend.documents.some(doc => doc.hasAudio))
    .flatMap(friend => friend.documents)
    .flatMap(document => document.editions)
    .filter(edition => !edition.isDraft)
    .map(edition => edition.audio)
    .filter(isDefined);

  for (let audio of audios.slice(0, argv.limit)) {
    await handleAudio(audio, argv);
  }
}

async function handleAudio(audio: Audio, argv: Argv): Promise<void> {
  const client = getClient();
  const edition = audio.edition;
  console.log('handle', edition.path);

  let paths: string[] = [];
  if (argv.all || argv.verifyLocalFilepaths || argv.uploadMp3s) {
    paths = verifyAudioPaths(audio);
  }

  if (argv.all || argv.uploadMp3s) {
    for (let path of paths) {
      const cloudPath = path.replace(/^.+\/(en|es)\//, '$1/');
      green(`uploading file: ${cloudPath}`);
      await cloud.uploadFile(path, cloudPath);
    }
  }

  const tmpDir = `/tmp/${uuid()}`;
  let artworkPath = '';
  if (argv.all || argv.setPlaylistArtwork || argv.setTrackArtwork) {
    fs.mkdirpSync(tmpDir);
    artworkPath = `${tmpDir}/artwork.png`;
    const buffer = await cloud.downloadFile(audio.imagePath);
    fs.writeFileSync(artworkPath, buffer);
  }

  if (argv.all || argv.verifyExternalTracks) {
    await verifyTracksExist(audio);
  }

  if (argv.all || argv.setTrackAttrs) {
    for (let part of audio.parts) {
      const attrs = {
        sharing: 'public',
        embeddable_by: 'all',
        track_type: 'spoken',
        commentable: 'false',
        downloadable: 'true',
        label_name: 'Friends Library Publishing',
      };
      await client.updateTrackAttrs(part.externalIdHq, attrs);
      await client.updateTrackAttrs(part.externalIdLq, attrs);
    }
  }

  if (argv.all || argv.setTrackArtwork) {
    for (let part of audio.parts) {
      await client.setTrackArtwork(part.externalIdHq, artworkPath);
      await client.setTrackArtwork(part.externalIdLq, artworkPath);
    }
  }

  if ((argv.all || argv.createMissingPlaylists) && audio.parts.length > 1) {
    if (!audio.externalPlaylistIdHq) {
      await createMissingPlaylist(audio, 'HQ');
    }
    if (!audio.externalPlaylistIdLq) {
      await createMissingPlaylist(audio, 'LQ');
    }
  }

  if ((argv.all || argv.createMissingPlaylists) && audio.parts.length > 1) {
    await client.setPlaylistArtwork(audio.externalPlaylistIdHq || 0, artworkPath);
    await client.setPlaylistArtwork(audio.externalPlaylistIdLq || 0, artworkPath);
  }

  if (argv.all || argv.setPlaylistArtwork || argv.setTrackArtwork) {
    fs.removeSync(tmpDir);
  }
}

async function createMissingPlaylist(audio: Audio, quality: 'HQ' | 'LQ'): Promise<void> {
  const edition = audio.edition;
  const document = edition.document;
  const playlistId = await getClient().createPlaylist({
    title: document.title,
    description: edition.description || document.description,
    tags: [quality as string].concat(document.tags),
    tracks: audio.parts.map(p => (quality === 'HQ' ? p.externalIdHq : p.externalIdLq)),
  });
  const key = `external_playlist_id_${quality.toLowerCase()}`;
  red(`SET in .yml: ${edition.path}/audio ${key}: ${playlistId}`);
  process.exit(1);
}

async function verifyTracksExist(audio: Audio): Promise<void> {
  for (let part of audio.parts) {
    const trackHq = await getClient().getTrack(part.externalIdHq);
    if (trackHq === null) {
      throw new Error(`HQ track not found for ${audio.edition.path} ${part.title}`);
    }
    const trackLq = await getClient().getTrack(part.externalIdLq);
    if (trackLq === null) {
      throw new Error(`LQ track not found for ${audio.edition.path} ${part.title}`);
    }
  }
}

function verifyAudioPaths(audio: Audio): string[] {
  const syncPath = `/Users/jared/Sync/${audio.edition.path}`;
  const paths = audio.parts.flatMap((part, idx) => {
    let path = `${syncPath}/${audio.edition.document.filenameBase}`;
    if (audio.parts.length > 1) {
      path += `--pt${idx + 1}`;
    }
    return [`${path}.mp3`, `${path}--lq.mp3`];
  });

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
    'SOUNDCLOUD_USERNAME',
    'SOUNDCLOUD_PASSWORD',
    'SOUNDCLOUD_CLIENT_ID',
    'SOUNDCLOUD_CLIENT_SECRET',
  );

  client = new Client({
    username: SOUNDCLOUD_USERNAME,
    password: SOUNDCLOUD_PASSWORD,
    clientId: SOUNDCLOUD_CLIENT_ID,
    clientSecret: SOUNDCLOUD_CLIENT_SECRET,
  });

  return client;
}
