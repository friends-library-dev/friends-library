import { Base64 } from 'js-base64';
import pullRequest from '../pull-request';
import getLintAnnotations from '../lint-adoc';

jest.mock('../lint-adoc');

describe('pullRequest()', () => {
  let payload;
  let github;
  let context;

  beforeEach(() => {
    let id = 1;
    github = {
      checks: {
        create: jest.fn(),
        update: jest.fn(),
      },
      pullRequests: {
        listFiles: jest.fn(),
      },
      repos: {
        getContents: jest.fn(),
      },
    };
    payload = {
      action: 'opened',
      number: 11,
      pull_request: {
        head: {
          sha: '2d306bb70578e6c019e3579c02d4f78f17bf915e'
        },
      },
      repository: {
        name: 'jane-doe',
      }
    };
    context = {
      payload,
      github,
      repo: obj => ({
        ...obj,
        owner: 'friends-library-sandbox',
        repo: 'jane-doe',
      }),
      issue: (obj = {})=> ({
        ...obj,
        owner: 'friends-library-sandbox',
        repo: 'jane-doe',
        number: 11,
      }),
    };

    github.checks.create
      .mockResolvedValueOnce({ data: { id: 1 }})
      .mockResolvedValueOnce({ data: { id: 2 }});

    github.pullRequests.listFiles
      .mockResolvedValue({ data: [] });

    github.pullRequests.listFiles
      .mockResolvedValueOnce({ data: [{ filename: '01.adoc' }] });

    github.repos.getContents
      .mockResolvedValueOnce({ data: { content: Base64.encode('== Ch 1') }});

    getLintAnnotations.mockReturnValue([]);
  });

  it('ignores PR opened on monorepo', async () => {
    payload.repository.name = 'friends-library';
    await pullRequest(context);
    expect(github.checks.create).not.toHaveBeenCalled();
  });

  it('creates a queued check for kite-ing', async () => {
    await pullRequest(context);
    expect(github.checks.create.mock.calls[0][0]).toMatchObject({
      status: 'queued',
      name: 'fl-bot/kite',
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
    });
  });

  it('creates an in_progress check for linting', async () => {
    await pullRequest(context);
    expect(github.checks.create.mock.calls[1][0]).toMatchObject({
      status: 'in_progress',
      name: 'fl-bot/lint-asciidoc',
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
    });
  });

  it('requests modified files for PR', async () => {
    await pullRequest(context);
    expect(github.pullRequests.listFiles).toHaveBeenCalledWith({
      owner: 'friends-library-sandbox',
      repo: 'jane-doe',
      number: 11,
    })
  });

  it('fetches file content for PR modified files', async () => {
    await pullRequest(context);
    expect(github.repos.getContents).toHaveBeenCalledWith({
      owner: 'friends-library-sandbox',
      repo: 'jane-doe',
      path: '01.adoc',
      ref: '2d306bb70578e6c019e3579c02d4f78f17bf915e',
    })
  });

  it('passes modified files off to linter', async () => {
    await pullRequest(context);
    expect(getLintAnnotations).toHaveBeenCalledWith([{
      path: '01.adoc',
      adoc: '== Ch 1',
    }])
  });

  it('passes the check if no lint annotations', async () => {
    getLintAnnotations.mockReturnValueOnce([]);
    await pullRequest(context);
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 2,
      status: 'completed',
      conclusion: 'success',
    });
  });

  it('fails the check if lint annotations', async () => {
    getLintAnnotations.mockReturnValueOnce(['foo']);
    await pullRequest(context);
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 2,
      status: 'completed',
      conclusion: 'failure',
      output: {
        annotations: ['foo'],
      }
    });
  });
});
