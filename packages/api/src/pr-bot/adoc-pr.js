// @flow
import path from 'path';
import { getFriend } from '@friends-library/friends';
import type { Url, Sha } from '../../../../type';
import type { WebhookPayload } from '../type';
import * as gh from './github';
import * as pdf from './pdf';
import * as cloud from './cloud';

export async function adocPrCommitHandler(event: string, payload: WebhookPayload): * {
  const {
    number,
    repository: { name: repo },
    pull_request: { head: { sha } }
  } = payload;

  const friend = getFriend(repo);
  const modifiedFiles = await gh.getModifiedFiles(repo, number);
  const allFiles = await gh.getPrFiles(repo, sha);
  const jobs = pdf.createJobs(friend, modifiedFiles, allFiles);
  const pdfs = await pdf.makePdfs(jobs);
  const uploadMap = getUploadMap(pdfs, repo, number);
  const urls = await cloud.uploadFiles(uploadMap);
  const body = getComment(urls, sha);
  gh.updateableComment(repo, number, body, 'PDF previews (commit');
}

function getComment(urls: Array<Url>, sha: Sha): string {
  const list = urls.map(u => `- [${path.basename(u)}](${u})`).join('\n');
  return `PDF previews (commit ${sha}):\n\n${list}`;
}

function getUploadMap(
  pdfs: Array<string>,
  repo: string,
  number: number,
): Map<string, string> {
  return pdfs.reduce((map, pdf) => {
    const filename = path.basename(pdf);
    return map.set(`adoc-pr/${repo}/${number}/${filename}`, pdf);
  }, new Map());
}
