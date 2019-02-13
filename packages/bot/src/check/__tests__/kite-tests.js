import kiteCheck from '../kite';
import { prTestSetup } from '../../__tests__/helpers';

describe('kiteCheck()', () => {
  let payload;
  let github;
  let context;

  beforeEach(() => {
    [context, payload, github] = prTestSetup();
  });

  it('creates a queued check run', async () => {
    console.log(context);
    await kiteCheck(context);
    expect(github.checks.create.mock.calls[0][0]).toMatchObject({
      status: 'queued',
      name: 'fl-bot/kite',
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
    });
  });
});
