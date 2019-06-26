import chalk from 'chalk';
import fs from 'fs-extra';
import { extname } from 'path';
import { exec } from 'child_process';
import { Arguments } from 'yargs';
import { lintPath, lintFixPath, createSourceSpec } from '@friends-library/asciidoc';
import { red } from '@friends-library/cli/color';
import { printLints } from '../lint/handler';
import { precursorsFromPath } from './precursors';
import { makeEpub } from '../../publish/epub/make';
import { makeMobi } from '../../publish/mobi/make';
import { makePdf } from '../../publish/pdf/make';
import { send } from './send';
import { withCoverServer } from './cover-server';
import { PUBLISH_DIR } from '../../publish/file';
import {
  Job,
  JobMeta,
  PrintSizeAbbrev,
  SourcePrecursor,
  SourceSpec,
  FileType,
  DocumentArtifacts,
} from '@friends-library/types';

export interface PublishOptions {
  path: string;
  noFrontmatter: boolean;
  perform: boolean;
  email?: string;
  send: boolean;
  glob?: string;
  open: boolean;
  target: FileType[];
  check: boolean;
  skipLint: boolean;
  fix: boolean;
  condense: boolean;
  createEbookCover: boolean;
  useCoverDevServer: boolean;
  printSize?: PrintSizeAbbrev;
}

export default async function handler(argv: Arguments<PublishOptions>): Promise<void> {
  if (argv.skipLint !== true) {
    lint(argv.path, argv.fix);
  }

  const publish: () => Promise<void> = async () => {
    prepPublishDir();
    const precursors = precursorsFromPath(argv.path);
    await publishPrecursors(precursors, argv);
  };

  if (!argv.createEbookCover) {
    await publish();
    return;
  }

  await withCoverServer(publish, argv.useCoverDevServer);
  process.exit();
}

export type PublishPrecursorOpts = Omit<
  PublishOptions,
  'path' | 'glob' | 'skipLint' | 'fix' | 'useCoverDevServer'
>;

export async function publishPrecursors(
  precursors: SourcePrecursor[],
  opts: PublishPrecursorOpts,
): Promise<DocumentArtifacts[]> {
  const meta = extractMeta(opts);
  const jobs = getJobs(precursors, meta, opts.target);
  const complete = Promise.all(jobs.map(take));

  if (opts.open) {
    complete.then(artifacts => open(artifacts));
  }

  if (opts.send) {
    complete.then(() => send(jobs.map(j => j.filename), opts.email));
  }
  return complete;
}

export function prepPublishDir(): void {
  fs.removeSync(PUBLISH_DIR);
  fs.ensureDir(PUBLISH_DIR);
}

function extractMeta(
  argv: Pick<
    PublishOptions,
    'perform' | 'check' | 'noFrontmatter' | 'condense' | 'createEbookCover' | 'printSize'
  >,
): JobMeta {
  return {
    perform: argv.perform,
    check: argv.check,
    frontmatter: !argv.noFrontmatter,
    condense: argv.condense,
    createEbookCover: argv.createEbookCover,
    ...(argv.printSize ? { printSize: argv.printSize } : {}),
  };
}

function getJobs(
  precursors: SourcePrecursor[],
  meta: JobMeta,
  targets: FileType[],
): Job[] {
  const specs = precursors.map(createSourceSpec);

  specs.forEach(spec => {
    if (spec.conversionLogs.length) {
      console.error(spec.conversionLogs);
      throw new Error(chalk.red('Asciidoc conversion error!'));
    }
  });

  return specs.reduce(
    (acc, spec) => {
      targets.forEach(target => {
        acc.push({
          id: `${target}/${spec.id}`,
          spec,
          target,
          meta,
          filename: jobFilename(target, spec, meta.perform),
        });
      });
      return acc;
    },
    [] as Job[],
  );
}

export function take(job: Job): Promise<DocumentArtifacts> {
  switch (job.target) {
    case 'epub':
      return makeEpub(job);
    case 'mobi':
      return makeMobi(job);
    default:
      return makePdf(job);
  }
}

function jobFilename(
  target: FileType,
  { filename }: SourceSpec,
  perform: boolean,
): string {
  switch (target) {
    case 'pdf-print':
      return `${filename}--(print).pdf`;
    case 'pdf-web':
      return `${filename}.pdf`;
    case 'mobi': {
      // kindle app needs unique filenames to differentiate test docs
      const timestamp = Math.floor(Date.now() / 1000);
      return `${filename}${perform ? '' : `--${timestamp}`}.mobi`;
    }
    default:
      return `${filename}.epub`;
  }
}

function lint(path: string, fix: boolean): void {
  if (fix === true) {
    const { unfixable, numFixed } = lintFixPath(path);
    if (unfixable.count() > 0) {
      printLints(unfixable);
      red(
        `\n\nERROR: ${unfixable.count()} remaining lint errors (fixed ${numFixed}). 😬 `,
      );
      process.exit(1);
    }
  }

  const lints = lintPath(path);
  if (lints.count() > 0) {
    printLints(lints);
    red(`\n\nERROR: ${lints.count()} lint errors must be fixed. 😬 `);
    process.exit(1);
  }
}

function open(artifacts: DocumentArtifacts[]): void {
  artifacts
    .map(({ filePath }) => filePath)
    .forEach(path => {
      switch (extname(path)) {
        case '.epub':
          exec(`open -a "Books" "${path}"`);
          return;
        case '.mobi':
          exec(`open -a "/Applications/Kindle.app" "${path}"`);
          return;
        default:
          exec(`open "${path}"`);
      }
    });
}
