import * as friends from '@friends-library/friends';
import stripIndent from 'strip-indent';
import { handleNewCommit } from '../adoc-pr';
import * as gh from '../github';
import * as pdf from '../pdf';
import * as cloud from '../cloud';

jest.mock('@friends-library/friends');
jest.mock('../github');
jest.mock('../pdf');
jest.mock('../cloud');

describe('handleNewCommit()', () => {
  let payload;

  beforeEach(() => {
    jest.resetAllMocks();
    pdf.makePdfs.mockReturnValue([]);
    cloud.uploadFiles.mockReturnValue([]);
    payload = {
      number: 11,
      pull_request: {
        head: {
          sha: "2d306bb70578e6c019e3579c02d4f78f17bf915e"
        }
      },
      repository: {
        name: 'jane-doe',
      },
    };
  });

  it('calls gh.getModifiedFiles with the right params', async () => {
    await handleNewCommit('pull_request', payload);
    expect(gh.getModifiedFiles).toBeCalledWith('jane-doe', 11);
  });

  it('calls gh.getPrFiles with right params', async () => {
    const { pull_request: { head: { sha } } } = payload;
    await handleNewCommit('pull_request', payload);
    expect(gh.getPrFiles).toBeCalledWith('jane-doe', sha);
  });

  it('calls pdf.createJobs with correct args', async () => {
    friends.getFriend.mockReturnValue('FakeFriend');
    const modifiedFiles = ['file.adoc'];
    const prFiles = new Map([['file.adoc', '== Chapter 1']]);
    gh.getModifiedFiles.mockReturnValue(modifiedFiles);
    gh.getPrFiles.mockReturnValue(prFiles);
    await handleNewCommit('pull_request', payload);
    expect(friends.getFriend).toBeCalledWith('jane-doe');
    expect(pdf.createJobs).toBeCalledWith(
      'FakeFriend',
      modifiedFiles,
      prFiles,
      '2d306bb70578e6c019e3579c02d4f78f17bf915e',
    );
  });

  it('calls pdf.createPdfs with created jobs', async () => {
    const jobs = ['my fake job'];
    pdf.createJobs.mockReturnValue(jobs);
    await handleNewCommit('pull_request', payload);
    expect(pdf.makePdfs).toBeCalledWith(jobs);
  });

  it('calls cloud.uploadFiles with the correct map of files', async () => {
    pdf.makePdfs.mockReturnValue(['/path/to/created.pdf']);
    await handleNewCommit('pull_request', payload);
    expect(cloud.uploadFiles).toBeCalledWith(new Map([[
      'adoc-pr/jane-doe/11/created.pdf',
      '/path/to/created.pdf',
    ]]), { delete: true });
  });

  it('calls gh.updateableComment with correct params', async () => {
    cloud.uploadFiles.mockReturnValue(['http://foo.com/bar/2d306bb--some.pdf']);
    await handleNewCommit('pull_request', payload);

    const body = stripIndent(`
      PDF previews (commit 2d306bb70578e6c019e3579c02d4f78f17bf915e):

      - [some.pdf](http://foo.com/bar/2d306bb--some.pdf)
    `).trim();

    expect(gh.updateableComment).toBeCalledWith(
      'jane-doe',
      11,
      body,
      'PDF previews (commit',
    );
  });
});
