import { Document, Edition, Audio, Friend } from '@friends-library/friends';
import { Url, ArtifactType } from '@friends-library/types';

export function friendUrl(friend: Friend): Url {
  if (friend.slug === 'compilations') {
    return '/compilations';
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

export function audioUrl(audio: Audio): Url {
  return `${editionUrl(audio.edition)}/audio`;
}

export function podcastUrl(audio: Audio): Url {
  return `${editionUrl(audio.edition)}/podcast.rss`;
}

export function logDownloadUrl(edition: Edition, type: ArtifactType): string {
  return [
    '/.netlify/functions/site/download/web',
    edition.document.id,
    edition.path,
    type,
    edition.filename(type),
  ].join('/');
}
