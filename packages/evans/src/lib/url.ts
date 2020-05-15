import { Document, Edition, Audio, Friend } from '@friends-library/friends';
import { Url, AudioQuality, DownloadFormat } from '@friends-library/types';

export function friendUrl(friend: Friend): Url {
  if (friend.slug === 'compilations') {
    return '/compilations';
  }

  if (friend.slug === 'compilaciones') {
    return '/compilaciones';
  }

  if (friend.lang === 'en') {
    return `/friend/${friend.slug}`;
  }

  const pref = friend.isMale ? 'amigo' : 'amiga';
  return `/${pref}/${friend.slug}`;
}

export function documentUrl(document: Document): Url {
  return `/${document.friend.slug}/${document.slug}`;
}

export function editionUrl(edition: Edition): Url {
  return `${documentUrl(edition.document)}/${edition.type}`;
}

export function podcastUrl(audio: Audio, quality: AudioQuality): Url {
  const filename = `podcast${quality === 'LQ' ? '--lq' : ''}.rss`;
  return logUrl(audio.edition, 'podcast', filename);
}

export function m4bDownloadUrl(audio: Audio, quality: AudioQuality): Url {
  const filename = quality === 'HQ' ? audio.m4bFilenameHq : audio.m4bFilenameLq;
  return logUrl(audio.edition, 'm4b', filename);
}

export function mp3ZipDownloadUrl(audio: Audio, quality: AudioQuality): Url {
  const filename = quality === 'HQ' ? audio.zipFilenameHq : audio.zipFilenameLq;
  return logUrl(audio.edition, 'mp3-zip', filename);
}

export function mp3PartDownloadUrl(
  audio: Audio,
  quality: AudioQuality,
  index: number,
): string {
  return logUrl(audio.edition, 'mp3', audio.partFilename(index, quality));
}

export function artifactDownloadUrl(
  edition: Edition,
  type: 'epub' | 'mobi' | 'web-pdf',
): string {
  return logUrl(edition, type, edition.filename(type));
}

function logUrl(edition: Edition, type: DownloadFormat, filename: string): string {
  return [
    '/.netlify/functions/site/log/download',
    edition.document.id,
    edition.path,
    type,
    filename,
  ].join('/');
}
