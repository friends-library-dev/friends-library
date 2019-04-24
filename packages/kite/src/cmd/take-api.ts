import { cloud } from '@friends-library/client';
import { requireEnv, DocumentArtifacts } from '@friends-library/types';
import { unstringifyJob } from '@friends-library/asciidoc';
import fs from 'fs-extra';
import { dirname } from 'path';
import fetch from 'node-fetch';
import { take } from './publish/handler';

export const command = 'take:api';

export const describe = 'take a job from the API';

export async function handler(): Promise<void> {
  const res = await fetch(`${API_URL || ''}/kite-jobs/take`);
  if (res.status === 204) {
    console.log('No jobs to process.');
    return;
  }

  const { id, job: jobStr, upload_path: uploadPath } = await res.json();
  const job = unstringifyJob(jobStr);

  let result: DocumentArtifacts;
  try {
    result = await take(job);
  } catch (e) {
    updateJob(id, { status: 'failed' });
    return;
  }

  const { filePath, srcDir } = result;
  fs.removeSync(dirname(srcDir));
  const cloudPath = `${uploadPath}/${job.filename}`;
  const url = await cloud.uploadFile(filePath, cloudPath, { delete: true });
  updateJob(id, { status: 'succeeded', url });
}

function updateJob(id: any, body: any): void {
  fetch(`${API_URL || ''}/kite-jobs/${id}`, {
    method: 'patch',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
}

const { API_URL } = requireEnv('API_URL');
