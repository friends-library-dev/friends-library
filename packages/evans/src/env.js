// @flow

const { env } = process;

type NodeEnv = 'production' | 'development';

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
export const LANG: 'en' | 'es' = env.LANG === 'es' ? 'es' : 'en';

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
