import moment from 'moment';
import * as kiteJob from '../kite-job';
import * as db from '../db';

jest.mock('../db');


describe('take()', () => {
  let now;

  beforeEach(() => {
    now = moment();
    jest.clearAllMocks();
  });

  it('fails hopeless stale jobs', async () => {
    db.select.mockResolvedValue([
      {
        id: 'job-1',
        attempts: 3,
        status: 'in_progress',
        updated_at: now.subtract(2, 'hours').toDate(),
        created_at: now.subtract(4, 'hours').toDate(),
      },
    ]);

    await getTakeResponse();

    expect(db.query).toHaveBeenCalledWith(
      'UPDATE `kite_jobs` SET `status` = ?, `updated_at` = ? WHERE `id` = ?',
      ['failed', expect.anything(), 'job-1'],
    );
  });

  it('returns no job if the system is working on one', async () => {
    db.select.mockResolvedValue([
      {
        id: 'job-1',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(20, 'seconds').toDate(),
        created_at: now.subtract(30, 'seconds').toDate(),
      },
      {
        id: 'job-2', // should not be handed out, because other is in progress
        attempts: 0,
        status: 'queued',
        updated_at: now.subtract(10, 'seconds').toDate(),
        created_at: now.subtract(10, 'seconds').toDate(),
      },
    ]);

    const { status, json } = await getTakeResponse();

    expect(status).toBe(204);
    expect(json).toBeUndefined();
  });

  it('prioritizes new jobs over re-trying stale ones', async () => {
    db.select.mockResolvedValue([
      { // stale job, should be retried
        id: 'job-1',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(10, 'minutes').toDate(),
        created_at: now.subtract(10, 'minutes').toDate(),
      },
      { // this untried job is newer, so must wait it's turn
        id: 'job-2',
        attempts: 0,
        status: 'queued',
        updated_at: now.subtract(20, 'seconds').toDate(),
        created_at: now.subtract(20, 'seconds').toDate(),
      },
      { // this oldest, untried job gets priority
        id: 'job-3',
        attempts: 0,
        status: 'queued',
        updated_at: now.subtract(30, 'seconds').toDate(),
        created_at: now.subtract(30, 'seconds').toDate(),
      },
    ]);

    const { json } = await getTakeResponse();
    expect(json.id).toBe('job-3');
  });

  it('updates taken job status, attempts, updated_at', async () => {
    db.select.mockResolvedValue([
      {
        id: 'job-1',
        attempts: 0,
        status: 'queued',
        updated_at: now.subtract(10, 'seconds').toDate(),
        created_at: now.subtract(10, 'seconds').toDate(),
      },
    ]);
    const { json } = await getTakeResponse();
    expect(json.id).toBe('job-1');
    expect(db.query.mock.calls[0][0]).toBe(
      'UPDATE kite_jobs SET status = ?, attempts = ?, updated_at = ? WHERE id = ?',
    );
    expect(db.query.mock.calls[0][1][0]).toBe('in_progress');
    expect(db.query.mock.calls[0][1][1]).toBe(1);
    expect(db.query.mock.calls[0][1][2]).toBeTruthy();
    expect(db.query.mock.calls[0][1][2]).not.toBe('2019-02-15T20:10:18.000Z');
    expect(db.query.mock.calls[0][1][3]).toBe('job-1');
  });

  it('retries oldest stale job if no new jobs to give', async () => {
    db.select.mockResolvedValue([
      {
        id: 'job-2',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(8, 'minutes').toDate(),
        created_at: now.subtract(9, 'minutes').toDate(),
      },
      {
        id: 'job-1',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(10, 'minutes').toDate(),
        created_at: now.subtract(11, 'minutes').toDate(),
      },
    ]);

    const { json } = await getTakeResponse();

    expect(json.id).toBe('job-1');
  });
});

async function getTakeResponse() {
  let json;
  let status;
  const res = {
    status(st) {
      status = st;
      return { end: () => {} };
    },
    json(js) {
      json = js;
    },
  };
  await kiteJob.take(null, res);
  return { json, status };
}
