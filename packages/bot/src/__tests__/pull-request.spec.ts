import { cloud } from '@friends-library/client';
import kiteCheck from '../check/kite';
import lintCheck from '../check/lint';
import { prTestSetup } from './helpers';
import pullRequest from '../pull-request';

jest.mock('@friends-library/client');
jest.mock('@friends-library/asciidoc');
jest.mock('../check/kite');
jest.mock('../check/lint');

describe('pullRequest()', () => {
  let payload: any;
  let github: any;
  let context: any;

  beforeEach(() => {
    [context, github, payload] = prTestSetup();
  });

  it('does not do asciidoc checks for monorepo', () => {
    payload.repository.name = 'friends-library';
    pullRequest(context);
    expect(github.checks.create).not.toHaveBeenCalled();
    expect(kiteCheck).not.toHaveBeenCalled();
    expect(lintCheck).not.toHaveBeenCalled();
  });

  it('adds netlify comment for monorepo PRs', () => {
    payload.repository.name = 'friends-library';
    payload.action = 'opened';
    pullRequest(context);
    expect(github.issues.createComment).toHaveBeenCalledWith({
      number: 11,
      owner: 'friends-library-sandbox',
      repo: 'friends-library',
      body: expect.any(String),
    });
    expect(github.issues.createComment.mock.calls[0][0].body).toMatchSnapshot();
  });

  it('does not add netlify comment when monorepo PR not opened', () => {
    payload.repository.name = 'friends-library';
    payload.action = 'synchronize';
    pullRequest(context);
    expect(github.issues.createComment).not.toHaveBeenCalled();
  });

  it('requests modified files for PR', () => {
    pullRequest(context);
    expect(github.pullRequests.listFiles).toHaveBeenCalledWith({
      owner: 'friends-library-sandbox',
      repo: 'jane-doe',
      number: 11,
      per_page: 100,
    });
  });

  it('fetches file content for PR modified files', async () => {
    await pullRequest(context);
    await Promise.resolve();
    await Promise.resolve();

    expect(github.repos.getContents).toHaveBeenCalledWith({
      owner: 'friends-library-sandbox',
      repo: 'jane-doe',
      path: '01.adoc',
      ref: '2d306bb70578e6c019e3579c02d4f78f17bf915e',
    });
  });

  it('passes fetched files to lint and kite checks', async () => {
    const files = [{ path: '01.adoc', adoc: '== Ch 1' }];
    await pullRequest(context);
    expect(lintCheck).toHaveBeenCalledWith(expect.anything(), files);
    expect(kiteCheck).toHaveBeenCalledWith(expect.anything(), files);
  });

  it('deletes cloud PR preview files on PR close', () => {
    payload.action = 'closed';
    pullRequest(context);
    expect(cloud.rimraf).toHaveBeenCalledWith('pull-request/jane-doe/11');
  });
});
