import { Lang, NodeEnv, Url, isDefined } from '@friends-library/types';

if (
  !isDefined(process.env.NODE_ENV) ||
  !['production', 'development'].includes(process.env.NODE_ENV)
) {
  throw new Error(`process.env.NODE_ENV must be set to "production" or "development"`);
}
export const NODE_ENV: NodeEnv = process.env.NODE_ENV as NodeEnv;

export const LANG: Lang = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

export const API_URL: Url =
  typeof process.env.API_URL === 'string' ? process.env.API_URL : '';

export const PORT = String(process.env.GATSBY_PORT || '');

/**
 * Api url
 *
 * @type {Url}
 */
export const APP_URL: Url = (() => {
  if (NODE_ENV === 'development') {
    return `http://localhost:${PORT}`;
  }

  if (process.env.HEAD === 'master') {
    return String(process.env.URL);
  }

  return String(process.env.DEPLOY_PRIME_URL);
})();
