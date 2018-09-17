// @flow
import fs from 'fs-extra';
import { flow } from 'lodash';
import { red, green } from '@friends-library/color';
import hilkiah from '@friends-library/hilkiah';
import { splitLines } from './split';
import { combineLines } from './combine';
import { processAsciidoc } from './process';

const { execSync } = require('child_process');

export default function convert(file: string): void {
  const { src, target } = validate(file);
  prepMultiParagraphFootnotes(src);
  generateRawAsciiDoc(src, target);

  const processed = flow(
    combineLines,
    replaceScriptureReferences,
    splitLines,
    processAsciidoc,
    str => str.replace(/{•}/gm, '.').replace(/{\^}/gm, ':'),
  )(fs.readFileSync(target).toString());

  fs.writeFileSync(target, processed);
  green(`Processed asciidoc file overwritten at: ${target}`);
}

function prepMultiParagraphFootnotes(src: string): void {
  const xml = fs.readFileSync(src).toString();
  const replaced = xml.replace(
    /<footnote>([\s\S]+?)<\/footnote>/gm,
    (_, note) => {
      const prepped = note.replace(
        /<\/para><para> */g,
        '{footnote-paragraph-split}',
      );
      return `<footnote>${prepped}</footnote>`;
    },
  );
  if (replaced !== xml) {
    fs.writeFileSync(src, replaced);
  }
}

function validate(src: string): {| src: string, target: string |} {
  if (!fs.existsSync(src)) {
    red(`ERROR: Source file ${src} does not exist!`);
    process.exit();
  }

  const target = src.replace(/\.xml$/, '.adoc');
  if (fs.existsSync(target)) {
    red(`ERROR: Target file ${target} already exists!`);
    process.exit();
  }

  return { src, target };
}

function generateRawAsciiDoc(src: string, target: string): void {
  // @todo remove hardcoded ref to docbookrx
  execSync(`cd ~/msf/asciidoctor/docbookrx && bundle exec docbookrx ${src}`, {
    stdio: [0, 1, 2],
  });
  green(`Raw asciidoc file generated at: ${target}`);
}

function replaceScriptureReferences(input: string): string {
  return input
    .split('\n')
    .map(line => {
      let replaced = line;
      const refs = hilkiah.find(line);
      refs.forEach(ref => {
        replaced = replaced.replace(
          ref.match,
          hilkiah.format(ref)
            .replace(/\./gm, '{•}')
            .replace(/:/gm, '{^}'), // prevent next step from splitting on . or :
        );
      });
      return replaced;
    })
    .join('\n');
}
