import { Request, Response } from 'express';
import moment from 'moment';
import * as kiteJob from '../kite-job';
import * as db from '../db';

jest.mock('../db');

describe('create()', () => {
  let res: Response;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('sends a 400 if missing required body props', async () => {
    const body = { bad: 'data 😬' };
    await kiteJob.create(req({ body }), res);
    expect(res.status).toHaveBeenCalledWith(400);
  });

  it('sends 201 and job id if inserted succesfully', async () => {
    const body = { job: {}, uploadPath: '/foo' };
    await kiteJob.create(req({ body }), res);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith({ id: expect.any(String) });
  });

  it('sends 500 of db insert throws', async () => {
    (<jest.Mock>db.insert).mockImplementation(() => {
      throw new Error('');
    });
    const body = { job: {}, uploadPath: '/foo' };
    await kiteJob.create(req({ body }), res);
    expect(res.status).toHaveBeenCalledWith(500);
  });
});

describe('list()', () => {
  let res: Response;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('can return filtered=working results', async () => {
    const now = moment();
    (<jest.Mock>db.select).mockResolvedValue([
      {
        // this job should come back as "working"
        id: 'job-1',
        attempts: 1,
        status: 'in_progress',
        url: null,
        updated_at: now.subtract(3, 'minutes').toDate(),
        created_at: now.subtract(3, 'minutes').toDate(),
      },
      {
        // this job should not come back
        id: 'job-2',
        attempts: 0,
        status: 'queued',
        url: null,
        updated_at: now.subtract(20, 'seconds').toDate(),
        created_at: now.subtract(20, 'seconds').toDate(),
      },
    ]);

    await kiteJob.list(req({ query: { filter: 'working' } }), res);
    const json = (<jest.Mock>res.json).mock.calls[0][0];
    expect(json).toHaveLength(1);
    expect(json[0].id).toBe('job-1');
  });
});

describe('get()', () => {
  let res: Response;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('sends 404 if no results', async () => {
    (<jest.Mock>db.select).mockResolvedValue([]);
    await kiteJob.get(req({ params: { id: 'foo' } }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('sends job if found', async () => {
    (<jest.Mock>db.select).mockResolvedValue(['job']);
    await kiteJob.get(req({ params: { id: 'foo' } }), res);
    expect(res.json).toHaveBeenCalledWith('job');
  });
});

describe('destroy()', () => {
  let res: Response;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('returns 404 if nothing deleted', async () => {
    (<jest.Mock>db.query).mockResolvedValue({ affectedRows: 0 });
    await kiteJob.destroy(req({ params: { id: 'foo' } }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('sends 204 if found and deleted', async () => {
    (<jest.Mock>db.query).mockResolvedValue({ affectedRows: 1 });
    await kiteJob.destroy(req({ params: { id: 'foo' } }), res);
    expect(res.status).toHaveBeenCalledWith(204);
    expect(db.query).toHaveBeenCalledWith('DELETE FROM `kite_jobs` WHERE `id` = ?', [
      'foo',
    ]);
  });
});

describe('update', () => {
  let res: Response;

  beforeEach(() => {
    res = getSpyResponse();
  });

  it('sends 404 if job not found', async () => {
    (<jest.Mock>db.select).mockResolvedValue([]);
    await kiteJob.update(req({ params: { id: 'foo' } }), res);
    expect(res.status).toHaveBeenCalledWith(404);
  });

  it('updates record and sends id back', async () => {
    (<jest.Mock>db.select).mockResolvedValue(['job']);
    const body = { status: 'succeeded', url: '/foo' };
    await kiteJob.update(req({ params: { id: 'foo' }, body }), res);
    expect(db.query).toHaveBeenCalledWith(expect.any(String), [
      expect.any(Date),
      'succeeded',
      '/foo',
      'foo',
    ]);
  });
});

function getSpyResponse(): Response {
  const res: any = {
    status: jest.fn(() => res),
    send: jest.fn(),
    end: jest.fn(),
    json: jest.fn(),
  };
  return res as Response;
}

describe('take()', () => {
  let now: moment.Moment;

  beforeEach(() => {
    now = moment();
    jest.clearAllMocks();
  });

  it('fails hopeless stale jobs', async () => {
    (<jest.Mock>db.select).mockResolvedValue([
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
    (<jest.Mock>db.select).mockResolvedValue([
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
    (<jest.Mock>db.select).mockResolvedValue([
      {
        // stale job, should be retried
        id: 'job-1',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(10, 'minutes').toDate(),
        created_at: now.subtract(10, 'minutes').toDate(),
      },
      {
        // this untried job is newer, so must wait it's turn
        id: 'job-2',
        attempts: 0,
        status: 'queued',
        updated_at: now.subtract(20, 'seconds').toDate(),
        created_at: now.subtract(20, 'seconds').toDate(),
      },
      {
        // this oldest, untried job gets priority
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
    (<jest.Mock>db.select).mockResolvedValue([
      {
        id: 'job-1',
        attempts: 0,
        status: 'queued',
        updated_at: now.subtract(10, 'seconds').toDate(),
        created_at: now.subtract(10, 'seconds').toDate(),
      },
    ]);

    const { json } = await getTakeResponse();

    const calls = (<jest.Mock>db.query).mock.calls;
    expect(json.id).toBe('job-1');
    expect(calls[0][0]).toBe(
      'UPDATE kite_jobs SET status = ?, attempts = ?, updated_at = ? WHERE id = ?',
    );
    expect(calls[0][1][0]).toBe('in_progress');
    expect(calls[0][1][1]).toBe(1);
    expect(calls[0][1][2]).toBeTruthy();
    expect(calls[0][1][2]).not.toBe('2019-02-15T20:10:18.000Z');
    expect(calls[0][1][3]).toBe('job-1');
  });

  it('retries oldest stale job if no new jobs to give', async () => {
    (<jest.Mock>db.select).mockResolvedValue([
      {
        id: 'job-2',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(11, 'minutes').toDate(),
        created_at: now.subtract(12, 'minutes').toDate(),
      },
      {
        id: 'job-1',
        attempts: 1,
        status: 'in_progress',
        updated_at: now.subtract(14, 'minutes').toDate(),
        created_at: now.subtract(15, 'minutes').toDate(),
      },
    ]);

    const { json } = await getTakeResponse();

    expect(json.id).toBe('job-1');
  });
});

async function getTakeResponse(): Promise<{ json: any; status: number }> {
  let json: any = undefined;
  let status = 0;
  const res = {
    status(st: number) {
      status = st;
      return { end: () => {} };
    },
    json(js: any) {
      json = js;
    },
  };
  await kiteJob.take({} as Request, res as Response);
  return { json, status };
}

function req(mock: any): Request {
  return mock as Request;
}
