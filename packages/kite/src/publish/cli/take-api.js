// @flow
import { cloud } from '@friends-library/client';
import fs from 'fs-extra';
import { dirname } from 'path';
import fetch from 'node-fetch';
import { unstringifyJob } from '../job/utils';
import { take } from './';

const { env: { API_URL } } = process;

export default async function takeApi() {
  const res = await fetch(`${API_URL || ''}/kite-jobs/take`);
  if (res.status === 204) {
    console.log('No jobs to process.');
    return;
  }

  const { id, job: jobStr, upload_path: uploadPath } = await res.json();
  const job = unstringifyJob(jobStr);

  let result;
  try {
    // $FlowFixMe
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

function updateJob(id, body) {
  fetch(`${API_URL || ''}/kite-jobs/${id}`, {
    method: 'patch',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  });
}
