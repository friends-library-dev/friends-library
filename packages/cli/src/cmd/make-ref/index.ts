import { execSync } from 'child_process';
import { CommandBuilder, Arguments } from 'yargs';
import { deleteNamespaceDir } from '@friends-library/doc-artifacts';
import fs from 'fs-extra';
import path from 'path';
import { FsDocPrecursor, hydrate } from '@friends-library/dpc-fs';
import { MakeOptions, makeDpc } from '../make/handler';
import { builder as makeBuilder } from '../make';
import send from '../make/send';

export const command = `make:ref [basename]`;

export const describe = `make reference asciidoc document at given path`;

export const builder: CommandBuilder = async function (yargs) {
  if (typeof makeBuilder !== `function`) throw new Error(`Unexpected lack of builder fn`);
  return (await makeBuilder(yargs)).positional(`basename`, {
    type: `string`,
    default: `misc`,
    describe: `basename of reference doc (from packages/cli/src/make-ref)`,
  });
};

export async function handler(
  argv: Arguments<MakeOptions & { basename: string }>,
): Promise<void> {
  deleteNamespaceDir(`fl-make-ref`);
  const dpc = dpcFromPath(argv.basename);
  hydrate.process(dpc);
  const files = await makeDpc(dpc, { ...argv, skipLint: true }, `fl-make-ref`);
  !argv.noOpen && files.forEach((file) => execSync(`open "${file}"`));
  argv.send && send(files, argv.email);
}

function dpcFromPath(doc: string): FsDocPrecursor {
  const dpc = new FsDocPrecursor(
    `${__dirname}/${doc}.adoc`,
    `en/thomas-kite/ref-doc-${doc}/updated`,
  );
  dpc.documentId = `9986cb73-f240-4651-8c0c-636566f8c169`;
  dpc.revision = {
    timestamp: Math.floor(Date.now() / 1000),
    sha: `fb0c71b`,
    url: `https://github.com/ref/test/tree/fb0c71b/doc/edition`,
  };
  dpc.meta = {
    title: `Reference Document`,
    isbn: `978-1-64476-000-0`,
    author: {
      name: `Thomas Kite`,
      nameSort: `Kite, Thomas`,
    },
  };
  dpc.customCode.css[`paperback-interior`] = `.sect1 { page-break-before: avoid; }`;
  dpc.asciidoc = fs.readFileSync(path.resolve(__dirname, `${doc}.adoc`)).toString();
  return dpc;
}
