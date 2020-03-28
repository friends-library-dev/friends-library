import { Lang, NodeEnv, Url } from '@friends-library/types';

export const NODE_ENV: NodeEnv =
  process.env.NODE_ENV === 'production' ? 'production' : 'development';

export const LANG: Lang = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

export const PORT = String(process.env.GATSBY_PORT || '');

export const APP_URL: Url = (() => {
  if (NODE_ENV === 'development') {
    return `http://localhost:${PORT}`;
  }

  if (process.env.HEAD === 'master') {
    return String(process.env.URL);
  }

  return String(process.env.DEPLOY_PRIME_URL);
})();

export const APP_ALT_URL: Url = (() => {
  if (NODE_ENV === 'development') {
    return `http://localhost:${process.env.GATSBY_ALT_PORT}`;
  }

  if (process.env.HEAD === 'master') {
    return swapAltUrl(String(process.env.URL));
  }

  return swapAltUrl(String(process.env.DEPLOY_PRIME_URL));
})();

// @TODO this is hinky
function swapAltUrl(url: Url): Url {
  if (url === 'undefined') {
    return LANG === 'en'
      ? 'https://www.bibliotecadelosamigos.org'
      : 'https://www.friendslibrary.com';
  }

  if (url.includes('.netlify.com')) {
    return url.replace('en-evans.', 'es-evans.').replace('es-evans.', 'en-evans.');
  }

  if (url.includes('friendslibrary.com')) {
    return url.replace('friendslibrary.com', 'bibliotecadelosamigos.org');
  }

  return url.replace('bibliotecadelosamigos.org', 'friendslibrary.com');
}
