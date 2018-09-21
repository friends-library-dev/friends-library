// @flow
import fs from 'fs-extra';
import { defaults, omit } from 'lodash';
import type { Command, Job, SourceSpec, FileType, SourcePrecursor } from '../type';
import { makeEpub } from './epub/make';
import { makeMobi } from './mobi/make';
import { makePdf } from './pdf/make';
import { prepare } from './prepare';
import { getPrecursors } from './precursors';
import { send } from './send';
import { PUBLISH_DIR } from './file';

export default function publish(argv: Object): Promise<*> {
  const cmd = createCommand(argv);
  const precursors = getPrecursors(argv.path);
  return publishPrecursors(precursors, cmd);
}

export function publishPrecursors(
  precursors: Array<SourcePrecursor>,
  cmd: Command,
): Promise<*> {
  fs.removeSync(PUBLISH_DIR);
  fs.ensureDir(PUBLISH_DIR);

  const specs = precursors.map(prepare);
  const jobs = specs.reduce(reduceSpecsToJobs(cmd), []);
  const complete = Promise.all(jobs.map(take));

  if (cmd.send) {
    complete.then(() => send(jobs.map(j => j.filename), cmd));
  }

  return complete;
}

export function take(job: Job): Promise<string> {
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
  const cmd = defaults(omit(argv, ['$0', '_', 'path', 'no-frontmatter', 'print-size', 'debug-print-margins']), {
    target: ['epub', 'mobi', 'pdf-web', 'pdf-print'],
    perform: false,
    check: false,
    open: false,
    send: false,
    email: null,
    frontmatter: true,
    debugPrintMargins: false,
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

  // target=all shorthand for ALL formats (or leave off --target arg)
  if (cmd.targets.length === 1 && cmd.targets[0] === 'all') {
    cmd.targets = ['epub', 'mobi', 'pdf-print', 'pdf-web'];
  }

  return cmd;
}

export function reduceSpecsToJobs(cmd: Command): * {
  return (jobs: Array<Job>, spec: SourceSpec): Array<Job> => {
    cmd.targets.forEach(target => jobs.push({
      id: `${target}/${spec.id}`,
      spec,
      target,
      cmd,
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
