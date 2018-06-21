// @flow
/* eslint-disable no-use-before-define */
import { API_URL, LANG } from 'env';
import Friend from 'classes/Friend';
import Document from 'classes/Document';
import Edition from 'classes/Edition';
import Format from 'classes/Format';

type Entity = Friend | Format | Document | Edition;

function formatUrl(format: Format): string {
  const { edition } = format;
  const { document } = edition;

  if (['paperback', 'audio'].includes(format.type)) {
    return `${url(document)}/${edition.type}/${format.type}`;
  }

  return `${API_URL}/download${url(document)}/${edition.type}/${document.filename}--${edition.type}.${format.type}`;
}

function url(entity: Entity): string {
  if (entity instanceof Friend) {
    if (entity.slug === 'compilations') {
      return '/compilations'; // @TODO translate
    }

    if (LANG === 'en') {
      return `/friend/${entity.slug}`;
    }

    const amigo = entity.isMale() ? 'amigo' : 'amiga';
    return `/${amigo}/${entity.slug}`;
  }

  if (entity instanceof Document) {
    return `/${entity.friend.slug}/${entity.slug}`;
  }

  if (entity instanceof Format) {
    return formatUrl(entity);
  }

  return '/not-found';
}

export default url;
