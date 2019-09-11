import { Base64 } from 'js-base64';

export function prTestSetup(): [any, any, any] {
  const github = {
    checks: {
      create: jest.fn(),
      update: jest.fn(),
    },
    pullRequests: {
      listFiles: jest.fn(),
    },
    repos: {
      getContents: jest.fn(),
      getCommit: jest.fn(),
    },
    gitdata: {
      getTree: jest.fn(),
      getBlob: jest.fn(),
    },
    issues: {
      listComments: jest.fn(),
      createComment: jest.fn(),
      updateComment: jest.fn(),
    },
  };
  const payload = {
    action: 'opened',
    number: 11,
    pull_request: {
      url: 'https://api.github.com/repos/friends-library-sandbox/jane-doe/pulls/11',
      head: {
        sha: '2d306bb70578e6c019e3579c02d4f78f17bf915e',
      },
    },
    repository: {
      name: 'jane-doe',
    },
  };

  const log = (): void => {};
  log.trace = () => {};
  log.debug = () => {};
  log.info = () => {};
  log.warn = () => {};
  log.error = () => {};
  log.fatal = () => {};

  const context = {
    payload,
    github,
    repo: (obj: any) => ({
      ...obj,
      owner: 'friends-library-sandbox',
      repo: payload.repository.name,
    }),
    issue: (obj = {}) => ({
      ...obj,
      owner: 'friends-library-sandbox',
      repo: payload.repository.name,
      number: 11,
    }),
    log,
  };

  github.checks.create
    .mockResolvedValueOnce({ data: { id: 1 } })
    .mockResolvedValueOnce({ data: { id: 2 } });

  github.pullRequests.listFiles.mockResolvedValue({ data: [] });

  github.pullRequests.listFiles.mockResolvedValueOnce({
    data: [{ filename: '01.adoc' }],
  });

  github.repos.getContents.mockResolvedValueOnce({
    data: { content: Base64.encode('== Ch 1') },
  });

  github.issues.listComments.mockResolvedValue({ data: [] });

  return [context, github, payload];
}