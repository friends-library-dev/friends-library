const nock = require('nock')
// Requiring our app implementation
const myProbotApp = require('..')
const { Probot } = require('probot')
const { Base64 } = require('js-base64');
const { isMatch } = require('lodash');
const prOpenPayload = require('./fixtures/pull_request.opened')

nock.disableNetConnect();

jest.setTimeout(30000);

function mockTokenRequest(github) {
  github
    .post(`/app/installations/653584/access_tokens`)
    .optionally()
    .reply(200, { token: 'fake_test_token' });
}

describe('My Probot app', () => {
  let probot;
  let github;

  beforeEach(() => {
    github = nock('https://api.github.com');
    mockTokenRequest(github);
    probot = new Probot({})
    const app = probot.load(myProbotApp)
    app.app = () => 'fake_test_token'
  });

  afterEach(() => {
    nock.cleanAll();
  })

  test('ignores PR opened on monorepo', async () => {
    let checkCreated = false;
    github
      .post('/repos/friends-library-sandbox/friends-library/check-runs', (body) => {
        checkCreated = true;
        return true;
      })
      .reply(201);

    const payload = JSON.parse(JSON.stringify(prOpenPayload));
    payload.repository.name = 'friends-library';

    await probot.receive({ name: 'pull_request', payload });

    expect(checkCreated).toBe(false);
  });

  test.only('orchestrates checks for an asciidoc repo', async () => {
    const repo = '/repos/friends-library-sandbox/jane-doe';
    github
      .post(`${repo}/check-runs`, (body) => {
        return isMatch(body, {
          head_sha: '4e297933e00f7b7bc2612004501e69e7fb92ec27',
          status: 'queued',
          name: 'fl-bot/kite',
        });
      })
      .reply(201);

    github
      .post(`${repo}/check-runs`, (body) => {
        return isMatch(body, {
          head_sha: '4e297933e00f7b7bc2612004501e69e7fb92ec27',
          status: 'in_progress',
          name: 'fl-bot/lint-asciidoc',
        });
      })
      .reply(201, { id: 55555 });

    const file = 'sweet-book/original/01-intro.adoc';
    const sha = prOpenPayload.pull_request.head.sha;

    // fetch modified files
    github
      .get(`${repo}/pulls/14/files`)
      .reply(200, [{
        filename: file,
        contents_url: `https://api.github.com${repo}/contents/${file}?ref=${sha}`,
      }]);

    // fetch content of modified files for linting
    github
      .get(`${repo}/contents/${file}`)
      .query({ ref: sha })
      .reply(200, {
        content: Base64.encode('== Chapter 1\n\nFoo bar.'),
      });

    github
      .patch(`${repo}/check-runs/55555`, body => {
        console.log({ body });
        return isMatch(body, {
          status: 'completed',
          conclusion: 'failure',
          // output: {
          //   title: 'Terrible work, son!',
          //   summary: 'I expected better from you :(',
          // }
        })
      })
      .reply(201);

    await probot.receive({ name: 'pull_request', payload: prOpenPayload })


    // // creates kite check
    // expect(createBodies[0]).toMatchObject({
    //   head_sha: '4e297933e00f7b7bc2612004501e69e7fb92ec27',
    //   status: 'queued',
    //   name: 'fl-bot/kite',
    // });
    //
    // // creates lint check
    // expect(createBodies[1]).toMatchObject({
    //   head_sha: '4e297933e00f7b7bc2612004501e69e7fb92ec27',
    //   status: 'in_progress',
    //   name: 'fl-bot/lint-asciidoc',
    // });

    expect(github.pendingMocks()).toEqual([]);
  });
})
