// @flow
import { Base64 } from 'js-base64';
import { getFriend } from '@friends-library/friends';
import type { FilePath, Asciidoc } from '../../../../type';
import type { Context, ModifiedAsciidocFile } from '../type';
import * as kiteJobs from '../kite-jobs';

export default async function kiteCheck(
  context: Context,
  modifiedFiles: Array<ModifiedAsciidocFile>,
): Promise<void> {
  const { payload, github, repo } = context;
  const sha = payload.pull_request.head.sha;
  const { data: { id } } = await github.checks.create(repo({
    name: 'fl-bot/kite',
    head_sha: sha,
    status: 'queued',
    started_at: new Date(),
  }));

  const updateCheck = makeUpdateCheck(context, id);
  const prFiles = await getAllPrFiles(context);
  const friend = getFriend(payload.repository.name);
  const [jobs, listener] = await submitKiteJobs(friend, modifiedFiles, prFiles, sha);

  let statusUpdated = false;
  listener.on('update', ({ status }) => {
    if (status === 'in_progress' && !statusUpdated) {
      updateCheck('in_progress');
      statusUpdated = true;
    }
  });

  listener.on('timeout', () => updateCheck('completed', 'timed_out'));

  listener.on('complete', result => {
    if (!result.success) {
      updateCheck('completed', 'failure');
      return;
    }

    updateCheck('completed', 'success');
  });
}

async function submitKiteJobs(friend, modifiedFiles, prFiles, sha) {
  const jobs = kiteJobs.fromPR(friend, modifiedFiles, prFiles, sha);

  const jobMap = {};
  await Promise.all(jobs.map(job => {
    return kiteJobs.submit(job).then(id => {
      if (id) {
        jobMap[id] = job;
      }
    });
  }));

  const jobIds = Object.keys(jobMap);
  const jobListener = kiteJobs.listenAll(jobIds);
  return [jobMap, jobListener];
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
