// @flow
import Asciidoctor from 'asciidoctor.js';
import { query } from '@friends-library/friends';
import fs from 'fs-extra';
import { execSync } from 'child_process';
import { sync as glob } from 'glob';
import { basename, resolve as pathResolve } from 'path';
import type { Lang, SourceSpec } from '../type'
import { prepareAsciidoc, convert } from './asciidoc';
import { divide } from './divide';


export function specsFromPath(path: string): Array<SourceSpec> {
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

  return [buildSpec(lang, friend, document, edition)];
}


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


function buildSpec(
  lang: Lang,
  friendSlug: string,
  docSlug: string,
  editionSlug: string
): SourceSpec {
  const path = `${lang}/${friendSlug}/${docSlug}/${editionSlug}`;
  const adoc = prepareAsciidoc(globAsciidoc(path));
  const html = convert(adoc);
  const config = getConfig(path);
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
    html,
    config,
    sections: divide(html, config),
    filename: `${document.filename}--${edition.type}`,
  };
}

function getConfig(path: string): Object {
  const configPath = `${path}/../config.json`;
  if (!fs.existsSync(configPath)) {
    return {};
  }
  return JSON.parse(fs.readFileSync(configPath));
}

const ROOT: string = ((process.env.DOCS_REPOS_ROOT: any): string);

function resolveDocument(lang: Lang, friend: string, document: string) {
  const editions = glob(`${ROOT}/${lang}/${friend}/${document}/*`);
  return editions.map(path => buildSpec(lang, friend, document, basename(path)));
}

function resolveFriend(lang: Lang, friend: string) {
  const docs = glob(`${ROOT}/${lang}/${friend}/*`);
  return docs.reduce((acc, path) => acc.concat(resolveDocument(lang, friend, basename(path))), []);
}

function resolveLang(lang: Lang) {
  const friends = glob(`${ROOT}/${lang}/*`);
  return friends.reduce((acc, path) => acc.concat(resolveFriend(lang, basename(path))), []);
}
