// @flow
/* eslint-disable no-use-before-define */
import Friend from '../classes/Friend';
import Document from '../classes/Document';
import Edition from '../classes/Edition';
import Format from '../classes/Format';

type Entity = Friend | Format | Document | Edition;

const { env: { API_URL = '' } } = process;

function formatUrl(format: Format): string {
  const { edition } = format;
  const { document } = edition;

  if (['softcover', 'audio'].includes(format.type)) {
    return `${url(document)}/${edition.type}/${format.type}`;
  }

  // $FlowFixMe
  return `${API_URL}/download${url(document)}/${edition.type}/${document.filename}--${edition.type}.${format.type}`;
}

function url(entity: Entity): string {
  if (entity instanceof Friend) {
    return `/friend/${entity.slug}`;
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
