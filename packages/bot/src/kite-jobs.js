// @flow
import EventEmitter from 'events';
import fetch from 'node-fetch';
import { Friend } from '@friends-library/friends';
import type { FilePath, Asciidoc, Sha, Uuid } from '../../../type';
import type { Context, ModifiedAsciidocFile } from './type';
import type { Job } from '../../kite/src/type';
import JobListener from './job-listener';

const { env: { BOT_API_URL } } = process;

export function fromPR(
  friend: Friend,
  modifiedFiles: Array<ModifiedAsciidocFile>,
  prFiles: {[FilePath]: Asciidoc},
  sha: Sha,
): Array<Job> {
  return [];
}

export async function submit(job: Job): Promise<Uuid | false> {
  return await fetch(`${BOT_API_URL}/kite-jobs`, json({ job }))
    .then(res => res.json())
    .then(({ id }) => id)
    .catch(() => false);
}


export function listenAll(ids: Array<Uuid>): EventEmitter {
  return new JobListener(ids);
}

function json(body: Object | string | array): Object {
  return {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body),
  }
}
