import nock from 'nock';
import * as kiteJobs from '../kite-jobs';

describe('submit()', () => {
  it('posts data to api', async () => {
    nock('https://test-api.friendslibrary.com')
      .post('/kite-jobs', { job: 'job' })
      .reply(201, { id: 'job-id' });
    expect(await kiteJobs.submit('job')).toBe('job-id');
  });

  it('returns false if API errors', async () => {
    nock('https://test-api.friendslibrary.com')
      .post('/kite-jobs', { job: 'job' })
      .reply(400);
    expect(await kiteJobs.submit('job')).toBe(false);
  });
});
