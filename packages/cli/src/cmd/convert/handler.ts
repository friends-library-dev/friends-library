import fs from 'fs-extra';
import uuid from 'uuid/v4';
import { flow } from 'lodash';
import { spawnSync } from 'child_process';
import { red, green, cyan } from '@friends-library/cli-utils/color';
import { splitLines, refMutate, refUnmutate } from '@friends-library/adoc-utils';
import * as hilkiah from '@friends-library/hilkiah';
import { combineLines } from './combine';
import { processAsciidoc } from './process';
import { ensureDockerImage } from '../../docker';

interface ConvertOptions {
  file: string;
  skipRefs: boolean;
}

export default function convertHandler({ file, skipRefs }: ConvertOptions): void {
  const { src, target } = validate(file);
  if (skipRefs) {
    cyan(`Skipping processing scripture references due to --skip-refs flag`);
  }

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
    const prepped = note.replace(
      /<\/para>(\s*<para\/>\s*)?(<para\/>\s*)?(<para\/>\s*)?<para>\s*/g,
      `{footnote-paragraph-split}`,
    );
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

  const target = src.replace(/\.xml$/, `.adoc`);
  if (fs.existsSync(target)) {
    red(`ERROR: Target file ${target} already exists!`);
    process.exit();
  }

  return { src, target };
}

function generateRawAsciiDoc(src: string, target: string): void {
  const tag = `jaredh159/convert:1.0.0`;
  const opts = { cwd: __dirname };

  ensureDockerImage(tag, __dirname);

  const tmpDir = `/tmp/${uuid()}`;
  fs.mkdirSync(tmpDir);
  fs.copyFileSync(src, `${tmpDir}/document.xml`);

  // run the command in the docker container
  spawnSync(`docker`, [`run`, `--rm`, `--volume=${tmpDir}:/root/docs`, tag], opts);

  if (!fs.existsSync(`${tmpDir}/document.adoc`)) {
    red(`ERROR: Target file ${target} not generated!`);
    process.exit();
  }

  fs.copyFileSync(`${tmpDir}/document.adoc`, target);
  fs.rmdirSync(tmpDir, { recursive: true });

  green(`Raw asciidoc file generated at: ${target}`);
}

function replaceScriptureReferences(input: string): string {
  return input
    .split(`\n`)
    .map(line => {
      let replaced = line;
      const refs = hilkiah.find(line);
      refs.forEach(ref => {
        replaced = replaced.replace(ref.match, refMutate(hilkiah.format(ref)));
      });
      return replaced;
    })
    .join(`\n`);
}
