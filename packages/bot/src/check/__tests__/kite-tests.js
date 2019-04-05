import EventEmitter from 'events';
import { Base64 } from 'js-base64';
import stripIndent from 'strip-indent';
import { getFriend } from '@friends-library/friends';
import kiteCheck from '../kite';
import * as kiteJobs from '../../kite-jobs';
import { prTestSetup } from '../../__tests__/helpers';

jest.mock('@friends-library/friends');
jest.mock('../../kite-jobs');

describe('kiteCheck()', () => {
  let github;
  let context;
  let files;
  let listener;

  beforeEach(() => {
    [context, github] = prTestSetup();
    files = [{
      path: '01.adoc',
      adoc: '== Ch 1',
    }];

    github.repos.getCommit.mockResolvedValue({
      data: { commit: { tree: { sha: 'tree-sha' } } },
    });

    github.gitdata.getTree.mockResolvedValue({
      data: {
        tree: [
          {
            path: '01.adoc',
            type: 'blob',
            sha: 'blob-sha',
          },
        ],
      },
    });

    github.gitdata.getBlob.mockResolvedValue({
      data: {
        content: Base64.encode('Foobar.'),
      },
    });

    getFriend.mockReturnValue('FakeFriend');
    kiteJobs.fromPR.mockReturnValue(['job-1', 'job-2']);
    kiteJobs.submit.mockResolvedValueOnce('job-1-id');
    kiteJobs.submit.mockResolvedValueOnce('job-2-id');
    listener = new TestListener();
    kiteJobs.listenAll.mockReturnValue(listener);
  });

  afterEach(() => {
    listener.emit('timeout');
  });

  it('creates a queued check run', async () => {
    await kiteCheck(context, files);
    expect(github.checks.create.mock.calls[0][0]).toMatchObject({
      status: 'queued',
      name: 'create-pdf',
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
    });
  });

  it('fetches all of the PR files', async () => {
    await kiteCheck(context, files);

    expect(github.repos.getCommit).toHaveBeenCalledWith({
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
      sha: '2d306bb70578e6c019e3579c02d4f78f17bf915e',
    });

    expect(github.gitdata.getTree).toHaveBeenCalledWith({
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
      tree_sha: 'tree-sha',
      recursive: 1,
    });

    expect(github.gitdata.getBlob).toHaveBeenCalledWith({
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
      file_sha: 'blob-sha',
    });
  });

  it('retrieves friend from repository name', async () => {
    await kiteCheck(context, files);
    expect(getFriend).toHaveBeenCalledWith('jane-doe');
  });

  it('passes assembled data to kiteJobs.fromPR()', async () => {
    await kiteCheck(context, files);
    expect(kiteJobs.fromPR).toHaveBeenCalledWith(
      'FakeFriend',
      files,
      new Map([['01.adoc', 'Foobar.']]),
      '2d306bb70578e6c019e3579c02d4f78f17bf915e',
      true,
      false,
    );
  });

  it('submits created jobs', async () => {
    await kiteCheck(context, files);
    expect(kiteJobs.submit).toHaveBeenCalledWith({
      uploadPath: 'pull-request/jane-doe/11',
      job: 'job-1',
    });
    expect(kiteJobs.submit).toHaveBeenCalledWith({
      uploadPath: 'pull-request/jane-doe/11',
      job: 'job-2',
    });
  });

  it('creates listener with submitted job ids', async () => {
    await kiteCheck(context, files);
    expect(kiteJobs.listenAll).toHaveBeenCalledWith(['job-1-id', 'job-2-id']);
  });

  it('updates the check run to `in_progress` when first job is taken', async () => {
    await kiteCheck(context, files);
    expect(github.checks.update).not.toHaveBeenCalled();
    listener.emit('update', { status: 'in_progress' });
    listener.emit('update', { status: 'in_progress' });
    expect(github.checks.update).toHaveBeenCalledWith({
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
      check_run_id: 1,
      status: 'in_progress',
    });
    expect(github.checks.update).toHaveBeenCalledTimes(1);
  });

  it('deletes jobs as they finish, and deletes remaining at the end', async () => {
    await kiteCheck(context, files);

    // as soon as a job completes, we delete it
    expect(kiteJobs.destroy).toHaveBeenCalledTimes(0);
    listener.emit('update', { id: 'job-1-id', status: 'succeeded' });
    expect(kiteJobs.destroy).toHaveBeenCalledWith('job-1-id');
    expect(kiteJobs.destroy).toHaveBeenCalledTimes(1);

    // also clean up all remaining jobs when the listener shuts down
    listener.emit('shutdown');
    expect(kiteJobs.destroy).toHaveBeenCalledWith('job-2-id');
    expect(kiteJobs.destroy).toHaveBeenCalledTimes(2);
  });

  it('fails the check run when one job fails', async () => {
    await kiteCheck(context, files);
    listener.emit('complete', {
      success: false,
      jobs: {
        'job-id-1': { status: 'succeeded' },
        'job-id-2': { status: 'failed' },
      },
    });
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'failure',
    });
  });

  it('passes the check run when all jobs pass', async () => {
    await kiteCheck(context, files);
    listener.emit('complete', {
      success: true,
      jobs: {
        'job-id-1': { status: 'succeeded', url: '/path/2d306bb--orig.pdf' },
        'job-id-2': { status: 'succeeded', url: '/path/2d306bb--mod.pdf' },
      },
    });

    const summary = stripIndent(`
      We were able to simulate creating published PDF books with the edited files from this PR:

      - [2d306bb--orig.pdf](/path/2d306bb--orig.pdf)
      - [2d306bb--mod.pdf](/path/2d306bb--mod.pdf)
    `).trim();

    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'success',
      output: {
        title: 'PDF Creation Successful!',
        summary,
      },
    });
  });

  it('times out the check run if jobs timeout', async () => {
    await kiteCheck(context, files);
    listener.emit('timeout');
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'timed_out',
    });
  });

  describe('comment create/update on success:', () => {
    const complete = async () => {
      await kiteCheck(context, files);
      listener.emit('complete', {
        success: true,
        jobs: {
          'job-id-1': { status: 'succeeded', url: '/path/2d306bb--orig.pdf' },
        },
      });

      // drain the promise queue
      await Promise.resolve();
      await Promise.resolve();
    };

    it('creates a new comment if no comment exists', async () => {
      github.issues.listComments.mockResolvedValue({ data: [] });
      await complete();

      const body = stripIndent(`
        PDF previews (commit 2d306bb70578e6c019e3579c02d4f78f17bf915e):

        - [2d306bb--orig.pdf](/path/2d306bb--orig.pdf)
        <!-- check:kite -->
      `).trim();

      expect(github.issues.createComment).toHaveBeenCalledWith({
        repo: 'jane-doe',
        owner: 'friends-library-sandbox',
        number: 11,
        body,
      });
    });

    it('updates existing comment if comment exists', async () => {
      github.issues.listComments.mockResolvedValue({ data: [{
        id: 12345,
        body: '<!-- check:kite -->',
      }] });
      await complete();

      expect(github.issues.updateComment).toHaveBeenCalledWith({
        repo: 'jane-doe',
        owner: 'friends-library-sandbox',
        comment_id: 12345,
        body: expect.any(String),
      });
    });
  });
});

class TestListener extends EventEmitter {
  listen() {
    return Promise.resolve(this);
  }
}
