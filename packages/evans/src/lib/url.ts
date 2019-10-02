import { Format } from '@friends-library/friends';

export function formatUrl(format: Format): string {
  return [
    '/.netlify/functions/site/download/web',
    format.edition.document.id,
    format.edition.path,
    format.type === 'pdf' ? 'pdf-web' : format.type,
    format.filename(),
  ].join('/');
}
