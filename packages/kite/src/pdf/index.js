// @flow
import fs from 'fs-extra';
import path from 'path';
const { execSync } = require('child_process');
import striptags from 'striptags';
import type { SourceSpec, FileManifest } from '../type';

const css = fs.readFileSync('src/pdf/pdf.css').toString();
const line = fs.readFileSync('src/pdf/line.svg').toString();


export function printPdf(spec: SourceSpec): FileManifest {
  return {
    'book.html': getHtml(spec),
    'book.css': css,
    'line.svg': line,
  };
}

export function makePdf(manifest: FileManifest): void {
  fs.removeSync('_publish');
  fs.ensureDir('_publish');
  for (let path in manifest) {
    fs.outputFileSync(`_publish/pdf/${path}`, manifest[path]);
  }
  const src = path.resolve(__dirname, '../../_publish/pdf/book.html');
  execSync(`prince-books "${src}"`, {
    stdio: [0, 1, 2]
  });
}

function chPart(text: string, type: 'prefix' | 'body'): string {
  return `<span class="chapter-title__${type}">${text}</span>`;
}

function getHtml(spec: SourceSpec): string {
  let html = spec.html.replace(
    /<sup class="footnote">\[<a id="_footnoteref_([0-9]+).+?<\/sup>/igm,
    '<span class="footnote">{{{footnote: $1}}}</span>',
  );

  const footnotes = {};
  html = html.replace(
    /<div class="footnote" id="_footnotedef_([0-9]+)[\S\s]+?<\/div>/igm,
    (full, num) => {
      footnotes[num] = striptags(full, ['em', 'i', 'strong', 'b']).trim().replace(/^[0-9]+\. /, '');
      return '';
    }
  );

  html = html.replace(
    /{{{footnote: ([0-9]+)}}}/igm,
    (_, num) => footnotes[num],
  );

  html = html.replace(
    /(<h2[^>]+?>)(.*?)<\/h2>/igm,
    (full, open, title) => {
      if (title.indexOf(': ') === -1) {
        return full;
      }
      const [pref, body] = title.split(': ');
      return open + chPart(pref, 'prefix') + chPart(body, 'body') + '</h2>';
    }
  );


  return `
<!DOCTYPE html>
<html>
  <head>
    <link href="book.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    ${html}
  </body>
</html>
  `.trim();
}
