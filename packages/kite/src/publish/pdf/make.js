// @flow
/* istanbul ignore file */
import type { Job } from '../../type';
import { getPdfManifest } from './manifest';
import { prince } from './prince';

export function makePdf(job: Job) {
  const { spec, target, filename, meta: { open } } = job;
  const manifest = getPdfManifest(job);
  const dir = `${spec.filename}/${target}`;
  return prince(manifest, dir, filename, {
    open,
    formatOuput: l => `  ${job.filename} -> ${l}`,
  });
}
