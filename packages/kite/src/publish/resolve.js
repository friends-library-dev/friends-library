// @flow
import Asciidoctor from 'asciidoctor.js';
import { query } from '@friends-library/friends';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import { sync as glob } from 'glob';
import { basename, resolve as pathResolve } from 'path';
import type { Lang } from '../type'
import { prepareAsciidoc } from './asciidoc';


const ROOT: string = ((process.env.DOCS_REPOS_ROOT: any): string);


function globAsciidoc(dir: string): string {
  return glob(`${dir}/*.adoc`).map(path => fs.readFileSync(path).toString()).join('\n');
}

function gitRevision(path: string) {
  const cmd = 'git log --max-count=1 --pretty="%h|%ct" -- .';
  const [hash, date] = execSync(cmd, {
    cwd: pathResolve(__dirname, '../../', path),
  }).toString().split('|');
  return { date: +date, hash };
}


function data(
  lang: Lang,
  friendSlug: string,
  docSlug: string,
  editionSlug: string
) {
  const path = `${lang}/${friendSlug}/${docSlug}/${editionSlug}`;
  const adoc = prepareAsciidoc(globAsciidoc(path));
  const { friend, document, edition} = query(lang, friendSlug, docSlug, editionSlug);
  const { date, hash } = gitRevision(path);
  return {
    date,
    hash,
    lang,
    path,
    friend,
    document,
    edition,
    config: getConfig(path),
    filename: `${document.filename}--${edition.type}`,
    html: Asciidoctor().convert(adoc),
  };
}

function getConfig(path: string): Object {
  const configPath = `${path}/../config.json`;
  if (!fs.existsSync(configPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(configPath));
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
