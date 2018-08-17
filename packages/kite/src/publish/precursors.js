// @flow
import { query, Friend, Document, Edition } from '@friends-library/friends';
import fs from 'fs-extra';
import chalk from 'chalk';
import { execSync } from 'child_process';
import { sync as glob } from 'glob';
import { basename, resolve as pathResolve } from 'path';
import type { SourcePrecursor, Lang, Asciidoc } from '../type';

export function getPrecursors(path: string): Array<SourcePrecursor> {
  const [lang, friend, document, edition] = path.split('/');

  if (!lang) {
    return [...resolveLang('en'), ...resolveLang('es')];
  }

  if (lang !== 'en' && lang !== 'es') {
    throw new Error(`Invalid lang ${lang}`);
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

  return [buildPrecursor(lang, friend, document, edition)];
}


function gitRevision(path: string) {
  const cmd = 'git log --max-count=1 --pretty="%h|%ct" -- .';
  const [sha, timestamp] = execSync(cmd, {
    cwd: pathResolve(__dirname, '../../', path),
  }).toString().split('|');
  if (!sha || !timestamp) {
    console.log(chalk.red(`Could not determine git revision info for path: ${path}`));
    process.exit(1);
  }
  return {
    timestamp: +timestamp,
    sha,
  };
}


function buildPrecursor(
  lang: Lang,
  friendSlug: string,
  docSlug: string,
  editionType: string,
): SourcePrecursor {
  const path = `${lang}/${friendSlug}/${docSlug}/${editionType}`;
  const { sha, timestamp } = gitRevision(path);
  const { friend, document, edition } = query(lang, friendSlug, docSlug, editionType);
  validateQueried(friend, document, edition, path);
  return {
    id: path,
    config: getConfig(path),
    meta: {
      title: document.title,
      author: {
        name: friend.name,
        nameSort: friend.alphabeticalName(),
      },
      ...document.originalTitle ? { originalTitle: document.originalTitle } : {},
      ...document.published ? { published: document.published } : {},
    },
    filename: `${document.filename}--${edition.type}`,
    revision: {
      timestamp,
      sha,
      url: [
        'https://github.com/friends-library-docs',
        friendSlug,
        'tree',
        sha,
        docSlug,
        editionType,
      ].join('/'),
    },
    lang,
    adoc: globAsciidoc(path),
  };
}

function validateQueried(friend: Friend, document: Document, edition: Edition, path: string): void {
  if (friend.name === '') {
    console.log(chalk.red(`Failed to query Friend at path: ${path}`));
    process.exit(1);
  }
  if (document.title === '') {
    console.log(chalk.red(`Failed to query Document at path: ${path}`));
    process.exit(1);
  }
  if (edition.type === '') {
    console.log(chalk.red(`Failed to query Edition at path: ${path}`));
    process.exit(1);
  }
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
  return editions.map(path => buildPrecursor(lang, friend, document, basename(path)));
}

function resolveFriend(lang: Lang, friend: string) {
  const docs = glob(`${ROOT}/${lang}/${friend}/*`);
  return docs.reduce((acc, path) => acc.concat(resolveDocument(lang, friend, basename(path))), []);
}

function resolveLang(lang: Lang) {
  const friends = glob(`${ROOT}/${lang}/*`);
  return friends.reduce((acc, path) => acc.concat(resolveFriend(lang, basename(path))), []);
}

function globAsciidoc(dir: string): Asciidoc {
  return glob(`${dir}/*.adoc`).map(path => fs.readFileSync(path).toString()).join('\n');
}
