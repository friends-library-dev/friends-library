import { Lang, NodeEnv, Url, isDefined } from '@friends-library/types';

const env = process.env.NODE_ENV;

if (!isDefined(env) || !['production', 'development'].includes(env)) {
  throw new Error(`process.env.NODE_ENV must be set to "production" or "development"`);
}

export const NODE_ENV: NodeEnv = process.env.NODE_ENV as NodeEnv;

export const LANG: Lang = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

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
