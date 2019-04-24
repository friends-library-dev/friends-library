import path from 'path';
import { FilePath, Asciidoc, Sha, Url, Job } from '@friends-library/types';
import { Friend, getFriend } from '@friends-library/friends';
import { Base64 } from 'js-base64';
import { Context } from 'probot';
import { ModifiedAsciidocFile } from '../type';
import * as kiteJobs from '../kite-jobs';
import JobListener from '../job-listener';

interface JobResults {
  [k: string]: {
    url: Url;
    status: string;
  };
}

export default async function kiteCheck(
  context: Context,
  modifiedFiles: ModifiedAsciidocFile[],
): Promise<void> {
  const { payload, github, repo } = context;
  const {
    pull_request: {
      head: { sha },
    },
  } = payload;
  const {
    data: { id: checkId },
  } = await github.checks.create(
    repo({
      name: 'create-pdf',
      head_sha: sha,
      status: 'queued',
      started_at: new Date().toISOString(),
    }),
  );
  context.log.info('Created kite check');

  const updateCheck = makeUpdateCheck(context, checkId);

  let prFiles;
  try {
    prFiles = await getAllPrFiles(context);
    context.log.info('Got PR files');
    context.log.debug({ prFiles }, 'PR files');
  } catch (e) {
    context.log.error(e, 'Get PR files failure');
    updateCheck('completed', 'failure', {
      output: {
        title: 'Failed fetching PR files from GitHub',
        summary: e.message,
      },
    });
    return;
  }

  const repoName = payload.repository.name;
  let friend;
  try {
    friend = getFriend(repoName);
    context.log.info(`Got friend: ${repoName}`);
    context.log.debug({ friend }, 'Queried friend');
  } catch (e) {
    context.log.error(e, 'Get friend error');
    updateCheck('completed', 'failure', {
      output: {
        title: `Failure querying friend: ${repoName} from .yml`,
        summary: e.message,
      },
    });
    return;
  }

  let listener: JobListener;
  let jobIds: Set<string>;
  try {
    [listener, jobIds] = await submitKiteJobs(
      friend,
      modifiedFiles,
      prFiles,
      sha,
      `pull-request/${repoName}/${payload.number}`,
    );
    context.log.info('Submitted kite jobs');
    context.log.debug({ jobIds: [...jobIds] }, 'Job ids');
  } catch (e) {
    context.log.error(e, 'Submit kite jobs error');
    updateCheck('completed', 'failure', {
      output: {
        title: 'Error submitting kite jobs to API',
        summary: e.message,
      },
    });
    return;
  }

  let statusUpdated = false;
  listener.on('update', ({ id, status }) => {
    context.log.info(`Got job updated from id: ${id} with status: ${status}`);
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
    context.log.info('Listener timeout');
    updateCheck('completed', 'timed_out');
  });

  listener.on('complete', ({ success, jobs }: { success: boolean; jobs: JobResults }) => {
    context.log.info(`Listener complete, success: ${success ? 'true' : 'false'}`);
    context.log.debug({ jobs }, 'Listener complete jobs data');
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

  try {
    await listener.listen();
  } catch (e) {
    context.log.error(e, 'Job listener error');
    updateCheck('completed', 'failure', {
      output: {
        title: 'Error listening for kite jobs',
        summary: e.message,
      },
    });
  }
}

async function pdfComment(context: Context, jobs: JobResults): Promise<void> {
  const { github, issue, repo, payload } = context;
  const {
    pull_request: {
      head: { sha },
    },
  } = payload;
  const { data: comments } = await github.issues.listComments(issue({ per_page: 100 }));
  const existing = comments.find(comment => comment.body.includes('<!-- check:kite'));
  const body = getCommentBody(sha, jobs);
  if (existing) {
    github.issues.updateComment(repo({ body, comment_id: existing.id }));
    return;
  }
  github.issues.createComment(issue({ body }));
}

function getCommentBody(sha: Sha, jobs: JobResults): string {
  return `PDF previews (commit ${sha}):\n\n${pdfLinks(jobs)}\n<!-- check:kite -->`;
}

function getSummary(jobs: JobResults): string {
  const text =
    'We were able to simulate creating published PDF books with the edited files from this PR:';
  return `${text}\n\n${pdfLinks(jobs)}`;
}

function pdfLinks(jobs: JobResults): string {
  return Object.values(jobs)
    .map(({ url }) => {
      return `- [${path.basename(url)}](${url})`;
    })
    .join('\n');
}

async function submitKiteJobs(
  friend: Friend,
  modifiedFiles: ModifiedAsciidocFile[],
  prFiles: Map<string, string>,
  sha: string,
  uploadPath: string,
): Promise<[JobListener, Set<string>, { [k: string]: Job }]> {
  const jobs = kiteJobs.fromPR(friend, modifiedFiles, prFiles, sha, true, false);
  const jobMap: { [k: string]: Job } = {};
  await Promise.all(
    jobs.map(job => {
      return kiteJobs.submit({ job, uploadPath }).then(id => {
        if (!id) {
          throw new Error('Failed to submit kite job to API!');
        }
        jobMap[id] = job;
      });
    }),
  );

  const jobIds = Object.keys(jobMap);
  const jobListener = kiteJobs.listenAll(jobIds);
  return [jobListener, new Set(Object.keys(jobMap)), jobMap];
}

type CheckUpdater = (
  status: 'completed' | 'in_progress',
  conclusion?: 'timed_out' | 'failure' | 'success',
  data?: Record<string, any>,
) => Promise<any>;

function makeUpdateCheck(context: Context, checkRunId: number): CheckUpdater {
  const { github, repo } = context;
  return function updateCheck(status, conclusion, data = {}) {
    return github.checks.update(
      repo({
        check_run_id: checkRunId,
        status,
        ...data,
        ...(conclusion ? { conclusion } : {}),
        ...(status === 'completed' ? { completed_at: new Date().toISOString() } : {}),
      }),
    );
  };
}

async function getAllPrFiles(context: Context): Promise<Map<FilePath, Asciidoc>> {
  const { github, repo, payload } = context;

  // get tree sha for the PR commit
  const treeSha = await github.repos
    .getCommit(
      repo({
        sha: payload.pull_request.head.sha,
      }),
    )
    .then(res => res.data.commit.tree.sha);

  // get array of tree nodes for the tree sha
  const {
    data: { tree },
  } = await github.gitdata.getTree(
    repo({
      tree_sha: treeSha,
      recursive: 1,
    }),
  );

  interface TreeNode {
    type: string;
    sha: Sha;
    path: string;
  }

  // get file content for all non-dir tree nodes
  const files = new Map();
  const promises = tree
    .filter((node: TreeNode) => node.type === 'blob')
    .map((file: TreeNode) => {
      return github.gitdata
        .getBlob(
          repo({
            file_sha: file.sha,
          }),
        )
        .then(json => {
          context.log.info(`Received PR file at path: ${file.path}`);
          files.set(file.path, Base64.decode(json.data.content));
        });
    });

  await Promise.all(promises);
  return files;
}
