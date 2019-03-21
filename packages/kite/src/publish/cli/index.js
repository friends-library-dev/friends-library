// @flow
/* istanbul ignore file */
import fs from 'fs-extra';
import { defaults, omit } from 'lodash';
import { lintDir, lintFixDir, createSourceSpec } from '@friends-library/asciidoc';
import { red } from '@friends-library/cli/color';
import type { JobMeta, Job, SourceSpec, FileType, SourcePrecursor } from '../../type';
import { makeEpub } from '../epub/make';
import { makeMobi } from '../mobi/make';
import { makePdf } from '../pdf/make';
import { getPrecursors } from './precursors';
import { send } from '../send';
import { printLints } from '../../lint';
import { PUBLISH_DIR } from '../file';

type Command = JobMeta & {|
  targets: Array<FileType>,
|};

export default function publish(argv: Object): Promise<*> {
  const { path } = argv;

  if (!argv.skipLint) {
    lint(path, !!argv.fix);
  }

  const cmd = createCommand(argv);
  const precursors = getPrecursors(path);
  return publishPrecursors(precursors, cmd);
}

export function publishPrecursors(
  precursors: Array<SourcePrecursor>,
  cmd: Command,
): Promise<*> {
  resetPublishDir();
  const specs = precursors.map(createSourceSpec);
  // $FlowFixMe
  const jobs = specs.reduce(reduceSpecsToJobs(cmd), []);
  const complete = Promise.all(jobs.map(take));

  if (cmd.send) {
    complete.then(() => send(jobs.map(j => j.filename), cmd));
  }

  return complete;
}

function lint(path: string, fix: boolean): void {
  if (fix === true) {
    const { unfixable, numFixed } = lintFixDir(path);
    if (unfixable.count() > 0) {
      printLints(unfixable);
      red(`\n\nERROR: ${unfixable.count()} remaining lint errors (fixed ${numFixed}). 😬 `);
      process.exit(1);
    }
  }

  const lints = lintDir(path);
  if (lints.count() > 0) {
    printLints(lints);
    red(`\n\nERROR: ${lints.count()} lint errors must be fixed. 😬 `);
    process.exit(1);
  }
}

function resetPublishDir(): void {
  fs.removeSync(PUBLISH_DIR);
  fs.ensureDir(PUBLISH_DIR);
}

export function take(job: Job): Promise<*> {
  const { target } = job;

  switch (target) {
    case 'epub':
      return makeEpub(job);
    case 'mobi':
      return makeMobi(job);
    default:
      return makePdf(job);
  }
}

export function createCommand(argv: Object): Command {
  const remove = [
    '$0',
    '_',
    'path',
    'no-frontmatter',
    'print-size',
    'debug-print-margins',
  ];

  const cmd = defaults(omit(argv, remove), {
    target: ['pdf-print'],
    perform: false,
    check: false,
    open: false,
    send: false,
    email: null,
    frontmatter: true,
    debugPrintMargins: false,
    condense: false,
  });

  if (cmd.perform === true) {
    cmd.check = true;
  }

  if (typeof cmd.target === 'string') {
    cmd.target = [cmd.target];
  }

  cmd.targets = cmd.target;
  delete cmd.target;

  // target=ebook is shorthand for epub AND mobi
  if (cmd.targets.length === 1 && cmd.targets[0] === 'ebook') {
    cmd.targets = ['epub', 'mobi'];
  }

  // target=pdf is shorthand for pdf-print AND pdf-web
  if (cmd.targets.length === 1 && cmd.targets[0] === 'pdf') {
    cmd.targets = ['pdf-print', 'pdf-web'];
  }

  // target=all shorthand for ALL formats
  if (cmd.targets.length === 1 && cmd.targets[0] === 'all') {
    cmd.targets = ['epub', 'mobi', 'pdf-print', 'pdf-web'];
  }

  return cmd;
}

function reduceSpecsToJobs(cmd: Command): * {
  return (jobs: Array<Job>, spec: SourceSpec): Array<Job> => {
    cmd.targets.forEach(target => jobs.push({
      id: `${target}/${spec.id}`,
      spec,
      target,
      meta: cmd,
      filename: jobFilename(target, spec, cmd),
    }));
    return jobs;
  };
}

function jobFilename(target: FileType, { filename }: SourceSpec, cmd: Command): string {
  switch (target) {
    case 'pdf-print':
      return `${filename}--(print).pdf`;
    case 'pdf-web':
      return `${filename}.pdf`;
    case 'mobi': {
      // kindle app needs unique filenames to differentiate test docs
      const timestamp = Math.floor(Date.now() / 1000);
      return `${filename}${cmd.perform ? '' : `--${timestamp}`}.mobi`;
    }
    default:
      return `${filename}.epub`;
  }
}
