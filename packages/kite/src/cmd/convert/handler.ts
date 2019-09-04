import fs from 'fs-extra';
import { flow } from 'lodash';
import { execSync } from 'child_process';
import { red, green } from '@friends-library/cli/color';
import { splitLines, refMutate, refUnmutate } from '@friends-library/asciidoc';
import * as hilkiah from '@friends-library/hilkiah';
import { combineLines } from './combine';
import { processAsciidoc } from './process';

interface ConvertOptions {
  file: string;
  skipRefs: boolean;
}

export default function convertHandler({ file, skipRefs }: ConvertOptions): void {
  const { src, target } = validate(file);
  prepMultiParagraphFootnotes(src);
  generateRawAsciiDoc(src, target);

  const processed = flow(
    combineLines,
    skipRefs ? s => s : replaceScriptureReferences,
    splitLines,
    processAsciidoc,
    skipRefs ? s => s : refUnmutate,
  )(fs.readFileSync(target).toString());

  fs.writeFileSync(target, processed);
  green(`Processed asciidoc file overwritten at: ${target}`);
}

function prepMultiParagraphFootnotes(src: string): void {
  const xml = fs.readFileSync(src).toString();
  const replaced = xml.replace(/<footnote>([\s\S]+?)<\/footnote>/gm, (_, note) => {
    const prepped = note.replace(/<\/para><para> */g, '{footnote-paragraph-split}');
    return `<footnote>${prepped}</footnote>`;
  });
  if (replaced !== xml) {
    fs.writeFileSync(src, replaced);
  }
}

function validate(src: string): { src: string; target: string } {
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

  if (!fs.existsSync(target)) {
    red(`ERROR: Target file ${target} not generated!`);
    process.exit();
  }

  green(`Raw asciidoc file generated at: ${target}`);
}

function replaceScriptureReferences(input: string): string {
  return input
    .split('\n')
    .map(line => {
      let replaced = line;
      const refs = hilkiah.find(line);
      refs.forEach(ref => {
        replaced = replaced.replace(ref.match, refMutate(hilkiah.format(ref)));
      });
      return replaced;
    })
    .join('\n');
}
