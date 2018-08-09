// @flow
import fs from 'fs-extra';
import path from 'path';
import striptags from 'striptags';
import type { SourceSpec, FileManifest, Command, Css } from '../type';
import { frontmatter } from './frontmatter';

const { execSync } = require('child_process');

const line = fs.readFileSync('src/pdf/line.svg').toString();


export function pdf(spec: SourceSpec): FileManifest {
  return {
    'book.html': getHtml(spec),
    'book.css': getCss(spec),
    'line.svg': line,
  };
}

export function makePdf(
  manifest: FileManifest,
  filename: string,
  { open }: Command,
): void {
  const dir = `_publish/_src_/${filename}/pdf`;
  Object.keys(manifest).forEach(filepath => {
    fs.outputFileSync(`${dir}/${filepath}`, manifest[filepath]);
  });

  const src = path.resolve(__dirname, `../../${dir}/book.html`);
  execSync(`prince-books "${src}"`, {
    stdio: [0, 1, 2],
  });
  fs.moveSync(`${dir}/book.pdf`, `_publish/${filename}.pdf`);

  if (open) {
    execSync(`open "_publish/${filename}.pdf"`);
  }
}

const getCss = (() => {
  const css = ['base', 'half-title', 'original-title', 'copyright', 'toc']
    .map(slug => `src/pdf/css/${slug}.css`)
    .map(file => fs.readFileSync(file).toString())
    .join('\n');

  const printCss = fs.readFileSync('src/pdf/css/print.css');
  const webCss = fs.readFileSync('src/pdf/css/web.css');

  return (spec: SourceSpec): Css => {
    return css
      .concat(spec.target === 'pdf-web' ? webCss : printCss)
      .replace(/{{{ header.title }}}/g, spec.document.title);
  };
})();

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
    },
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
      return `${open + chPart(pref, 'prefix') + chPart(body, 'body')}</h2>`;
    },
  );

  html = html.replace(
    '<div class="sect1">',
    '<div class="sect1 first-chapter">',
  );

  return `
<!DOCTYPE html>
<html>
  <head>
    <link href="book.css" rel="stylesheet" type="text/css">
  </head>
  <body>
    ${frontmatter(spec)}
    ${html}
  </body>
</html>
  `.trim();
}
