import pullRequest from '../pull-request';

describe('pullRequest()', () => {
  let payload;
  let github;
  let context;

  beforeEach(() => {
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
    };
  });

  test('ignores PR opened on monorepo', () => {
    payload.repository.name = 'friends-library';
    pullRequest(context);
    expect(github.checks.create).not.toHaveBeenCalled();
  });
});
