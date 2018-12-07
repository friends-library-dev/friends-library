// @flow
import type { Lang, NodeEnv } from '../../../type';
const { env } = process;

/**
 * Node env
 *
 * @type {NodeEnv}
 */
export const NODE_ENV: NodeEnv = ((env.NODE_ENV: any): NodeEnv);

/**
 * Language
 *
 * @type {String}
 */
export const LANG: Lang = env.LANG === 'es' ? 'es' : 'en';

/**
 * Api url
 *
 * @type {String}
 */
export const API_URL: string = typeof env.API_URL === 'string' ? env.API_URL : '';

/**
 * Port
 *
 * @type {String}
 */
export const PORT: string = ((env.PORT: any): string);


/**
 * Api url
 *
 * @type {String}
 */
export const APP_URL: string = (() => {
  if (NODE_ENV === 'development') {
    return `http://localhost:${PORT}`;
  }

  if (env.HEAD === 'master') {
    return ((env.URL: any): string);
  }

  return ((env.DEPLOY_PRIME_URL: any): string);
})();
