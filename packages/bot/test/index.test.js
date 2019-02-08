const nock = require('nock')
// Requiring our app implementation
const myProbotApp = require('..')
const { Probot } = require('probot')
const prOpenPayload = require('./fixtures/pull_request.opened')

nock.disableNetConnect()

describe('My Probot app', () => {
  let probot

  beforeEach(() => {
    probot = new Probot({})
    const app = probot.load(myProbotApp)
    app.app = () => 'fake_test_token'
  })

  test('creates a passing check', async () => {
    nock('https://api.github.com')
      .post('/app/installations/2/access_tokens')
      .reply(200, { token: 'fake_test_token' })

    nock('https://api.github.com')
      .post('/repos/friends-library-sandbox/jane-doe/check-runs', (body) => {
        body.completed_at = '2018-10-05T17:35:53.683Z'
        expect(body).toMatchObject({ lol: 'rofl' });
        return true
      })
      .reply(200)

    // Receive a webhook event
    await probot.receive({ name: 'pull_request', payload: prOpenPayload })
  })
})
