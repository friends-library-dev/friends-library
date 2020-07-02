import fs from 'fs-extra';
import uuid from 'uuid/v4';
import { spawnSync } from 'child_process';
import { sync as glob } from 'glob';
import { deleteNamespaceDir, dirs } from '@friends-library/doc-artifacts';
import { red, green } from '@friends-library/cli-utils/color';
import { query as dpcQuery, FsDocPrecursor, hydrate } from '@friends-library/dpc-fs';
import { Asciidoc } from '@friends-library/types';
import { ensureDockerImage } from '../../docker';

export default async function handler({ pattern }: { pattern: string }): Promise<void> {
  const dpcs = dpcQuery.getByPattern(pattern);
  if (dpcs.length === 0) {
    red(`Pattern: \`${pattern}\` matched 0 docs.`);
    process.exit(1);
  }

  deleteNamespaceDir(`docx`);
  const { ARTIFACT_DIR: dir } = dirs({ namespace: `docx`, srcPath: `src` });
  fs.ensureDirSync(dir);
  ensureDockerImage(TAG, __dirname);

  dpcs.forEach(dpc => {
    hydrate.entities(dpc);
    const docxFilepath = makeDocx(dpc, dir);
    green(`.docx created at path: ${docxFilepath}`);
    spawnSync(`open`, [docxFilepath]);
  });
}

function makeDocx(dpc: FsDocPrecursor, dir: string): string {
  const tmpDir = `/tmp/${uuid()}`;
  fs.mkdirSync(tmpDir);
  fs.writeFileSync(`${tmpDir}/doc.adoc`, getJoinedAsciidoc(dpc.fullPath));

  dockerRun(`asciidoctor --backend docbook doc.adoc`, tmpDir);
  prepXml(`${tmpDir}/doc.xml`);
  dockerRun(`pandoc --from docbook --to docx --output doc.docx doc.xml`, tmpDir);

  const docPath = `${dir}/${dpc.edition?.filenameBase}.docx`;
  fs.moveSync(`${tmpDir}/doc.docx`, docPath);
  fs.rmdirSync(tmpDir, { recursive: true });
  return docPath;
}

function dockerRun(cmd: string, volume: string): void {
  spawnSync(
    `docker`,
    [`run`, `--rm`, `--volume=${volume}:/documents`, TAG, ...cmd.split(` `)],
    OPTS,
  );
}

function getJoinedAsciidoc(fullPath: string): Asciidoc {
  return glob(`${fullPath}/*.adoc`)
    .map(path => fs.readFileSync(path, `utf8`))
    .join(`\n\n`);
}

function prepXml(path: string): void {
  const xml = fs.readFileSync(path, `utf8`);
  const prepped = xml.replace(/{footnote-paragraph-split}/g, `<para />`);
  fs.writeFileSync(path, prepped);
}

const TAG = `jaredh159/docx:1.0.0`;
const OPTS = { cwd: __dirname };
