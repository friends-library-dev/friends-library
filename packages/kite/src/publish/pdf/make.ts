import { Job } from '@friends-library/types';
import { getPdfManifest } from './manifest';
import { prince } from './prince';

export function makePdf(job: Job) {
  const { spec, target, filename } = job;
  const manifest = getPdfManifest(job);
  const dir = `${spec.filename}/${target}`;
  return prince(manifest, dir, filename, {
    formatOutput: l => `  ${job.filename} -> ${l}`,
  });
}
