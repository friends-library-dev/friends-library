import { Lang, NodeEnv, Url } from '@friends-library/types';

export const NODE_ENV: NodeEnv =
  process.env.NODE_ENV === `production` ? `production` : `development`;

export const LANG: Lang = process.env.GATSBY_LANG === `es` ? `es` : `en`;

export const APP_URL: Url = (() => {
  if (NODE_ENV === `development`) {
    return `http://localhost:${process.env.GATSBY_PORT}`;
  }

  // this falls down for deploy previews created manually from
  // github actions, but there is currently no way to know before
  // deploy what the url of a draft preview will be, see:
  // @link https://community.netlify.com/t/10888/2
  return LANG === `en`
    ? `https://www.friendslibrary.com`
    : `https://www.bibliotecadelosamigos.org`;
})();

export const APP_ALT_URL: Url = (() => {
  if (NODE_ENV === `development`) {
    return `http://localhost:${process.env.GATSBY_ALT_PORT}`;
  }

  return LANG === `en`
    ? `https://www.bibliotecadelosamigos.org`
    : `https://www.friendslibrary.com`;
})();
