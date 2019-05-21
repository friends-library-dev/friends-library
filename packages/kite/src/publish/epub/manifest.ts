import { replaceHeadings } from '@friends-library/asciidoc';
import { flow, mapValues } from 'lodash';
import fs from 'fs';
import { Xml, Css, Html } from '@friends-library/types';
import { Job, FileManifest } from '@friends-library/types';
import { toCss } from '../file';
import { wrapHtml, removeMobi7Tags } from '../html';
import { packageDocument } from './package-document';
import { makeFootnoteCallReplacer, notesMarkup } from './notes';
import { nav } from './nav';
import { frontmatter } from './frontmatter';

interface SubManifest<T> {
  [key: string]: T;
}

export function getEpubManifest(job: Job): FileManifest {
  return mapValues(getEbookManifest(job), removeMobi7Tags);
}

export function getEbookManifest(job: Job): FileManifest {
  return {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': container(),
    'OEBPS/style.css': css(job),
    'OEBPS/package-document.opf': packageDocument(job),
    'OEBPS/nav.xhtml': wrapHtml(nav(job)),
    ...coverFiles(job),
    ...sectionFiles(job),
    ...notesFile(job),
    ...frontmatterFiles(job),
  };
}

function frontmatterFiles(job: Job): SubManifest<Html> {
  return Object.entries(frontmatter(job)).reduce(
    (files, [slug, html]) => {
      files[`OEBPS/${slug}.xhtml`] = wrapHtml(String(html));
      return files;
    },
    {} as SubManifest<Html>,
  );
}

function coverFiles(job: Job): SubManifest<Html> {
  const manifest: SubManifest<Html> = {};
  if (job.meta.createEbookCover) {
    manifest['OEBPS/cover.png'] = `${__dirname}/cover.png`;
    manifest['OEBPS/cover.xhtml'] = wrapHtml(
      '<figure id="cover"><img alt="Cover" src="cover.png"/></figure>',
      'cover',
    );
  }
  return manifest;
}

function sectionFiles(job: Job): SubManifest<Html> {
  const {
    spec: { sections },
  } = job;
  const replaceFootnoteCalls = makeFootnoteCallReplacer(job);
  return sections.reduce(
    (files, section) => {
      files[`OEBPS/${section.id}.xhtml`] = flow([
        replaceFootnoteCalls,
        html => replaceHeadings(html, section.heading, job),
        wrapHtml,
      ])(section.html);
      return files;
    },
    {} as SubManifest<Html>,
  );
}

function notesFile(job: Job): SubManifest<Html> {
  const {
    spec: { notes },
  } = job;
  if (!notes.size) {
    return {};
  }
  return {
    'OEBPS/notes.xhtml': wrapHtml(notesMarkup(job)),
  };
}

function css({ target, spec: { customCss } }: Job): Css {
  let combined = [
    toCss('sass/common.scss'),
    toCss('sass/ebook.scss'),
    ...(target === 'epub'
      ? [toCss('sass/not-mobi7.scss'), toCss('epub/sass/epub.scss')]
      : []),
  ].join('\n');

  if (target === 'mobi') {
    combined += `\n@media amzn-mobi {\n${toCss('mobi/sass/mobi.scss')}\n}`;
    combined += `\n@media amzn-kf8 {\n${toCss('sass/not-mobi7.scss')}\n${toCss(
      'mobi/sass/kf8.scss',
    )}\n}`;
  }

  combined += customCss.all || '';
  combined += customCss.ebook || '';
  combined += customCss[target] || '';

  return combined;
}

function container(): Xml {
  return `
<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/package-document.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>
  `.trim();
}
