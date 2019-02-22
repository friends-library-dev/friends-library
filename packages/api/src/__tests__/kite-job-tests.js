import moment from 'moment';
import * as kiteJob from '../kite-job';
import * as db from '../db';

jest.mock('../db');

describe('create()', () => {
  let res;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('sends a 400 if missing required body props', async () => {
    const body = { bad: 'data 😬' };
    await kiteJob.create({ body }, res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('sends 201 and job id if inserted succesfully', async () => {
    const body = { job: {}, uploadPath: '/foo' };
    await kiteJob.create({ body }, res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ id: expect.any(String) });
  });

  it('sends 500 of db insert throws', async () => {
    db.insert.mockImplementation(() => {
      throw new Error('');
    });
    const body = { job: {}, uploadPath: '/foo' };
    await kiteJob.create({ body }, res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('get()', () => {
  let res;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('sends 404 if no results', async () => {
    db.select.mockResolvedValue([]);
    await kiteJob.get({ params: { id: 'foo' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('sends job if found', async () => {
    db.select.mockResolvedValue(['job']);
    await kiteJob.get({ params: { id: 'foo' } }, res);
    expect(res.json).toHaveBeenCalledWith('job');
  });
});

describe('destroy()', () => {
  let res;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('returns 404 if nothing deleted', async () => {
    db.query.mockResolvedValue({ affectedRows: 0 });
    await kiteJob.destroy({ params: { id: 'foo' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('sends 204 if found and deleted', async () => {
    db.query.mockResolvedValue({ affectedRows: 1 });
    await kiteJob.destroy({ params: { id: 'foo' } }, res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(db.query).toHaveBeenCalledWith(
      'DELETE FROM `kite_jobs` WHERE `id` = ?',
      ['foo'],
    );
  });
});

describe('update', () => {
  let res;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('sends 404 if job not found', async () => {
    db.select.mockResolvedValue([]);
    await kiteJob.update({ params: { id: 'foo' } }, res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates record and sends id back', async () => {
    db.select.mockResolvedValue(['job']);
    const body = { status: 'succeeded', url: '/foo' };
    await kiteJob.update({ params: { id: 'foo' }, body }, res);
    expect(db.query).toHaveBeenCalledWith(
      expect.any(String),
      [expect.any(Date), 'succeeded', '/foo', 'foo'],
    );
  });
});

function getSpyResponse() {
  const res = {
    status: jest.fn(() => res),
    send: jest.fn(),
    end: jest.fn(),
    json: jest.fn(),
  };
  return res;
}

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
