// @flow
import type { Job } from '../../type';
import { getPdfManifest } from './manifest';
import { prince } from './prince';

export function makePdf(job: Job): Promise<string> {
  const { spec, target, filename, cmd: { open } } = job;
  const manifest = getPdfManifest(job);
  const dir = `${spec.filename}/${target}`;
  return prince(manifest, dir, filename, open, l => `  ${job.filename} -> ${l}`);
}
