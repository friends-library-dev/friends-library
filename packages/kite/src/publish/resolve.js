// @flow
import { query } from '@friends-library/friends';
import { sync as glob } from 'glob';
import { basename } from 'path';


const ROOT: string = ((process.env.DOCS_REPOS_ROOT: any): string);


function data(lang: string, friend: string, document: string, edition: string) {
  return {
    lang,
    path: `${lang}/${friend}/${document}/${edition}`,
    // ...query(lang, friend, document, edition),
  };
}

function resolveDocument(lang: string, friend: string, document: string) {
  const editions = glob(`${ROOT}/${lang}/${friend}/${document}/*`);
  return editions.map(path => data(lang, friend, document, basename(path)));
}

function resolveFriend(lang: string, friend: string) {
  const docs = glob(`${ROOT}/${lang}/${friend}/*`);
  return docs.reduce((acc, path) => acc.concat(resolveDocument(lang, friend, basename(path))), []);
}

function resolveLang(lang: string) {
  const friends = glob(`${ROOT}/${lang}/*`);
  return friends.reduce((acc, path) => acc.concat(resolveFriend(lang, basename(path))), []);
}

export function resolve(path: string): Array<*> {
  const [lang, friend, document, edition] = path.split('/');

  if (!lang) {
    return [...resolveLang('en'), ...resolveLang('es')];
  }

  if (!friend) {
    return resolveLang(lang);
  }

  if (!document) {
    return resolveFriend(lang, friend);
  }

  if (!edition) {
    return resolveDocument(lang, friend, document);
  }

  return [data(lang, friend, document, edition)];
}
