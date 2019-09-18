import {
  Xml,
  DocPrecursor,
  EbookConfig,
  FileManifest,
  Html,
  Lang,
} from '@friends-library/types';
import { packageDocument } from './package-document';
import { wrapHtmlBody } from '@friends-library/doc-html/dist/helpers';
import { nav } from './nav';

export default async function ebook(
  dpc: DocPrecursor,
  conf: EbookConfig,
): Promise<FileManifest> {
  return {
    mimetype: 'application/epub+zip',
    'META-INF/container.xml': container(),
    // 'OEBPS/style.css': css(job),
    'OEBPS/package-document.opf': packageDocument(dpc, conf),
    'OEBPS/nav.xhtml': wrapEbookBodyHtml(nav(dpc, conf), dpc.lang),
    // ...(await coverFiles(job)), // @TODO
    // ...sectionFiles(job),
    // ...notesFile(job),
    // ...frontmatterFiles(job),
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

function wrapEbookBodyHtml(bodyHtml: Html, lang: Lang): Html {
  return wrapHtmlBody(bodyHtml, {
    htmlAttrs: `xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" xml:lang="${lang}" lang="${lang}"`,
    css: ['style.css'],
    isUtf8: true,
  });
}

function sectionFiles(dpc: DocPrecursor): Record<string, Html> {
  const { sections } = dpc;
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
