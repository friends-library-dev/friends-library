import fetch from 'node-fetch';
import * as kiteJobs from '../kite-jobs';

jest.mock('node-fetch');
process.env.BOT_API_URL = '/api';

describe('submit()', () => {
  beforeEach(() => {
  });

  it('posts data to api', async () => {
    expect(await kiteJobs.submit()).toBe(false);
  });
});
