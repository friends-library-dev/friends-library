// @flow
import fs from 'fs-extra';
import { defaults, omit } from 'lodash';
import type { Command, Job, SourceSpec, FileType, SourcePrecursor } from '../type';
import { makeEpub } from './epub/make';
import { makeMobi } from './mobi/make';
import { makePdf } from './pdf/make';
import { prepare } from './spec';
import { getPrecursors } from './precursors';
import { send } from './send';

export default function publish(argv: Object): Promise<*> {
  const cmd = createCommand(argv);
  const precursors = getPrecursors(argv.path);
  return publishPrecursors(precursors, cmd);
}

export function publishPrecursors(
  precursors: Array<SourcePrecursor>,
  cmd: Command,
): Promise<*> {
  fs.removeSync('_publish');
  fs.ensureDir('_publish');

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
  const cmd = defaults(omit(argv, ['$0', '_', 'path']), {
    target: ['epub', 'mobi', 'pdf-web', 'pdf-print'],
    perform: false,
    check: false,
    open: false,
    send: false,
    email: null,
  });

  if (cmd.perform === true) {
    cmd.check = true;
  }

  if (typeof cmd.target === 'string') {
    cmd.target = [cmd.target];
  }

  cmd.targets = cmd.target;
  delete cmd.target;

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
