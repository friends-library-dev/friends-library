// @flow
import path from 'path';
import { Base64 } from 'js-base64';
import { getFriend } from '@friends-library/friends';
import type { FilePath, Asciidoc, Sha, Url } from '../../../../type';
import { values } from '../../../../flow-utils';
import type { Context, ModifiedAsciidocFile } from '../type';
import * as kiteJobs from '../kite-jobs';

type JobResult = {|
  url: Url,
  status: string,
|};

export default async function kiteCheck(
  context: Context,
  modifiedFiles: Array<ModifiedAsciidocFile>,
): Promise<void> {
  const { payload, github, repo } = context;
  const { pull_request: { head: { sha } } } = payload;
  const { data: { id: checkId } } = await github.checks.create(repo({
    name: 'fl-bot/kite',
    head_sha: sha,
    status: 'queued',
    started_at: new Date(),
  }));

  const updateCheck = makeUpdateCheck(context, checkId);
  const prFiles = await getAllPrFiles(context);
  const repoName = payload.repository.name;
  const friend = getFriend(repoName);
  const [listener, jobIds] = await submitKiteJobs(
    friend,
    modifiedFiles,
    prFiles,
    sha,
    `pull-request/${repoName}/${payload.number}`,
  );

  let statusUpdated = false;
  listener.on('update', ({ id, status }) => {
    if (status === 'in_progress' && !statusUpdated) {
      updateCheck('in_progress');
      statusUpdated = true;
    }
    if (status === 'succeeded' || status === 'failed') {
      kiteJobs.destroy(id);
      jobIds.delete(id);
    }
  });

  listener.on('timeout', () => {
    updateCheck('completed', 'timed_out');
  });

  listener.on('complete', ({ success, jobs }) => {
    if (!success) {
      updateCheck('completed', 'failure');
      return;
    }
    updateCheck('completed', 'success', {
      output: {
        title: 'PDF Creation Successful!',
        summary: getSummary(jobs),
      },
    });
    pdfComment(context, jobs);
  });

  listener.on('shutdown', () => {
    [...jobIds].forEach(id => kiteJobs.destroy(id));
  });

  await listener.listen();
}

async function pdfComment(
  context: Context,
  jobs: { [string]: JobResult },
): Promise<void> {
  const { github, issue, repo, payload } = context;
  const { pull_request: { head: { sha } } } = payload;
  const { data: comments } = await github.issues.listComments(issue({ per_page: 100 }));
  const existing = comments.find(comment => comment.body.includes('<!-- check:kite'));
  const body = getCommentBody(sha, jobs);
  if (existing) {
    return github.issues.updateComment(repo({ body, comment_id: existing.id }));
  }
  return github.issues.createComment(issue({ body }));
}

function getCommentBody(
  sha: Sha,
  jobs: { [string]: JobResult },
): string {
  return `PDF previews (commit ${sha}):\n\n${pdfLinks(jobs)}\n<!-- check:kite -->`;
}

function getSummary(jobs: { [string]: JobResult }): string {
  const text = 'We were able to simulate creating published PDF books with the edited files from this PR:';
  return `${text}\n\n${pdfLinks(jobs)}`;
}

function pdfLinks(jobs: { [string]: JobResult }): string {
  return values(jobs).map(({ url }) => {
    return `- [${path.basename(url)}](${url})`;
  }).join('\n');
}

async function submitKiteJobs(friend, modifiedFiles, prFiles, sha, uploadPath) {
  const jobs = kiteJobs.fromPR(friend, modifiedFiles, prFiles, sha);
  const jobMap = {};
  await Promise.all(jobs.map(job => {
    return kiteJobs.submit({ job, uploadPath }).then(id => {
      if (id) {
        jobMap[id] = job;
      }
    });
  }));

  const jobIds = Object.keys(jobMap);
  const jobListener = kiteJobs.listenAll(jobIds);
  return [jobListener, new Set(Object.keys(jobMap)), jobMap];
}

function makeUpdateCheck(context: Context, checkRunId: number) {
  const { github, repo } = context;
  return function updateCheck(status, conclusion = null, data = {}) {
    return github.checks.update(repo({
      check_run_id: checkRunId,
      status,
      ...data,
      ...conclusion ? { conclusion } : {},
      ...status === 'completed' ? { completed_at: new Date() } : {},
    }));
  };
}

async function getAllPrFiles(context: Context): Promise<Map<FilePath, Asciidoc>> {
  const { github, repo, payload } = context;

  // get tree sha for the PR commit
  const treeSha = await github.repos.getCommit(repo({
    sha: payload.pull_request.head.sha,
  })).then(res => res.data.commit.tree.sha);

  // get array of tree nodes for the tree sha
  const { data: { tree } } = await github.gitdata.getTree(repo({
    tree_sha: treeSha,
    recursive: 1,
  }));

  // get file content for all non-dir tree nodes
  const files = new Map();
  const promises = tree.filter(node => node.type === 'blob').map(file => {
    return github.gitdata.getBlob(repo({
      file_sha: file.sha,
    })).then(json => {
      files.set(file.path, Base64.decode(json.data.content));
    });
  });

  await Promise.all(promises);
  return files;
}
