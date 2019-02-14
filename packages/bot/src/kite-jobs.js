// @flow
import EventEmitter from 'events';
import fetch from 'node-fetch';
import { Friend } from '@friends-library/friends';
import type { FilePath, Asciidoc, Sha, Uuid } from '../../../type';
import type { Context, ModifiedAsciidocFile } from './type';
import type { Job } from '../../kite/src/type';

const { env: { BOT_API_URL } } = process;

export function fromPR(
  friend: Friend,
  modifiedFiles: Array<ModifiedAsciidocFile>,
  prFiles: {[FilePath]: Asciidoc},
  sha: Sha,
): Array<Job> {
  return [];
}

export async function submit(job: Job): Promise<Uuid> {
  return BOT_API_URL;
}


export function listenAll(ids: Array<Uuid>): EventEmitter {
  return new EventEmitter();
}
