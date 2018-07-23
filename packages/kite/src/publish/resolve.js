// @flow
import Asciidoctor from 'asciidoctor.js';
import { query } from '@friends-library/friends';
import { readFileSync } from 'fs';
import { sync as glob } from 'glob';
import { basename } from 'path';
import type { Lang } from '../type'
import { prepareAsciidoc } from './asciidoc';


const ROOT: string = ((process.env.DOCS_REPOS_ROOT: any): string);


function rawAsciidoc(dir: string): string {
  return glob(`${dir}/*.adoc`).map(path => readFileSync(path).toString()).join('\n');
}


function data(
  lang: Lang,
  friendSlug: string,
  docSlug: string,
  editionSlug: string
) {
  const path = `${lang}/${friendSlug}/${docSlug}/${editionSlug}`;
  const adoc = prepareAsciidoc(rawAsciidoc(path));
  const { friend, document, edition} = query(lang, friendSlug, docSlug, editionSlug);
  return {
    lang,
    path,
    friend,
    document,
    edition,
    filename: `${document.filename}--${edition.type}`,
    html: Asciidoctor().convert(adoc),
  };
}

function resolveDocument(lang: Lang, friend: string, document: string) {
  const editions = glob(`${ROOT}/${lang}/${friend}/${document}/*`);
  return editions.map(path => data(lang, friend, document, basename(path)));
}

function resolveFriend(lang: Lang, friend: string) {
  const docs = glob(`${ROOT}/${lang}/${friend}/*`);
  return docs.reduce((acc, path) => acc.concat(resolveDocument(lang, friend, basename(path))), []);
}

function resolveLang(lang: Lang) {
  const friends = glob(`${ROOT}/${lang}/*`);
  return friends.reduce((acc, path) => acc.concat(resolveFriend(lang, basename(path))), []);
}

export function resolve(path: string): Array<*> {
  let [lang, friend, document, edition] = path.split('/');

  if (!lang) {
    return [...resolveLang('en'), ...resolveLang('es')];
  }

  lang = ((lang: any): Lang);

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
