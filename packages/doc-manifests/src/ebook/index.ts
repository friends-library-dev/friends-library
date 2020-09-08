import {
  Xml,
  DocPrecursor,
  EbookConfig,
  FileManifest,
  Html,
  Lang,
} from '@friends-library/types';
import { replaceHeadings } from '@friends-library/doc-html';
import { mobi as mobiCss, epub as epubCss } from '@friends-library/doc-css';
import flow from 'lodash/flow';
import { packageDocument } from './package-document';
import wrapHtmlBody from '../wrap-html';
import { nav } from './nav';
import { makeFootnoteCallReplacer, notesMarkup } from './notes';
import { frontmatter } from '../frontmatter';

export default async function ebook(
  dpc: DocPrecursor,
  conf: EbookConfig,
): Promise<FileManifest[]> {
  return [
    {
      mimetype: `application/epub+zip`,
      'META-INF/container.xml': container(),
      'OEBPS/style.css': conf.subType === `epub` ? epubCss(dpc) : mobiCss(dpc),
      'OEBPS/package-document.opf': packageDocument(dpc, conf),
      'OEBPS/nav.xhtml': wrapEbookBodyHtml(nav(dpc, conf), dpc.lang),
      ...coverFiles(dpc, conf.coverImg),
      ...sectionFiles(dpc),
      ...notesFile(dpc),
      ...frontmatterFiles(dpc),
    },
  ];
}

function coverFiles(dpc: DocPrecursor, coverImg?: Buffer): FileManifest {
  if (!coverImg) return {};
  return {
    'OEBPS/cover.png': coverImg,
    'OEBPS/cover.xhtml': wrapEbookBodyHtml(
      `<figure><img alt="Cover" src="cover.png"/></figure>`,
      dpc.lang,
      `cover`,
    ),
  };
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

function wrapEbookBodyHtml(bodyHtml: Html, lang: Lang, bodyClass?: string): Html {
  return wrapHtmlBody(bodyHtml, {
    htmlAttrs: `xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}" lang="${lang}"`,
    css: [`style.css`],
    isUtf8: true,
    ...(bodyClass ? { bodyClass } : {}),
  });
}

function sectionFiles(dpc: DocPrecursor): Record<string, Html> {
  const { sections, lang } = dpc;
  const replaceFootnoteCalls = makeFootnoteCallReplacer(dpc);
  return sections.reduce((files, section) => {
    files[`OEBPS/${section.id}.xhtml`] = flow([
      replaceFootnoteCalls,
      (html) => replaceHeadings(html, section.heading, dpc),
      (html) => wrapEbookBodyHtml(html, lang),
    ])(section.html);
    return files;
  }, {} as Record<string, Html>);
}

function notesFile(dpc: DocPrecursor): Record<string, Html> {
  const { notes } = dpc;
  if (!notes.size) {
    return {};
  }
  return {
    'OEBPS/notes.xhtml': wrapEbookBodyHtml(notesMarkup(dpc), dpc.lang),
  };
}

function frontmatterFiles(dpc: DocPrecursor): Record<string, Html> {
  return Object.entries(frontmatter(dpc)).reduce((files, [slug, html]) => {
    files[`OEBPS/${slug}.xhtml`] = wrapEbookBodyHtml(String(html), dpc.lang);
    return files;
  }, {} as Record<string, Html>);
}
