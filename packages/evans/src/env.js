// @flow
import type { Lang, NodeEnv, Url } from '../../../type';

/**
 * Node env
 *
 * @type {NodeEnv}
 */
export const NODE_ENV: NodeEnv = ((process.env.NODE_ENV: any): NodeEnv);

/**
 * Language
 *
 * @type {String}
 */
export const LANG: Lang = process.env.GATSBY_LANG === 'es' ? 'es' : 'en';

/**
 * Api url
 *
 * @type {Url}
 */
export const API_URL: Url = typeof process.env.API_URL === 'string'
  ? process.env.API_URL
  : '';

/**
 * Port
 *
 * @type {String}
 */
export const PORT: string = ((process.env.GATSBY_PORT: any): string);

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
    return ((process.env.URL: any): string);
  }

  return ((process.env.DEPLOY_PRIME_URL: any): string);
})();
