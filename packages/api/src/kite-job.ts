import uuid from 'uuid/v4';
import moment, { Moment } from 'moment';
import { Request, Response } from 'express';
import * as db from './db';

const {
  env: { NODE_ENV },
} = process;
const isProd = NODE_ENV === 'production';

export async function create(req: Request, res: Response) {
  const body = <{ job: Object; uploadPath: string }>req.body;
  if (typeof body.uploadPath !== 'string' || typeof body.job !== 'object') {
    isProd && console.error('Invalid request body to POST /kite-jobs');
    res.status(400).send();
  }

  try {
    const id = uuid();
    await db.insert('kite_jobs', {
      id,
      upload_path: body.uploadPath,
      job: JSON.stringify(body.job),
    });
    res.status(201).send({ id });
  } catch (e) {
    isProd && console.error(`Db error creating kite job: ${e.message}`);
    res.status(500).send();
  }
}

export async function list(req: Request, res: Response) {
  let jobs = await db.select(
    'SELECT id, status, attempts, url, created_at, updated_at FROM `kite_jobs`',
  );
  convertTimestamps(jobs);
  if (req.query.filter === 'working') {
    jobs = getWorking(jobs);
  }
  res.json(jobs);
}

export async function get(req: Request, res: Response) {
  const {
    params: { id },
  } = req;
  const results = await db.select(
    'SELECT id, status, url FROM `kite_jobs` WHERE id = ?',
    [id],
  );
  if (!results.length) {
    isProd && console.error(`GET 404 /kite-jobs/${id}`);
    res.status(404).send();
    return;
  }
  res.json(results[0]);
}

export async function destroy(req: Request, res: Response) {
  const {
    params: { id },
  } = req;
  const result = await db.query('DELETE FROM `kite_jobs` WHERE `id` = ?', [id]);
  if (result.affectedRows !== 1) {
    isProd && console.error(`DELETE 404 /kite-jobs/${id}`);
    res.status(404).end();
    return;
  }
  res.status(204).end();
}

export async function update(req: Request, res: Response) {
  const {
    params: { id },
  } = req;
  const results = await db.select('SELECT id FROM `kite_jobs` WHERE id = ?', [id]);
  if (!results.length) {
    isProd && console.error(`PATCH 404 /kite-jobs/${id}`);
    res.status(404).send();
    return;
  }

  const body = <{ [key: string]: any }>req.body;
  const fillable = ['status', 'url'];
  const sets = ['`updated_at` = ?'];
  const params = [new Date()];
  fillable.forEach(column => {
    if (body[column]) {
      sets.push(`\`${column}\` = ?`);
      params.push(body[column]);
    }
  });

  await db.query(`UPDATE kite_jobs SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);

  res.json({ id });
}

type JobRow = {
  id: string;
  attempts: number;
  upload_path: string;
  status: 'queued' | 'in_progress' | 'succeeded' | 'failed';
  created_at: Moment;
  updated_at: Moment;
};

export async function take(req: Request, res: Response) {
  const cols = ['id', 'attempts', 'upload_path', 'status', 'created_at', 'updated_at'];

  const jobs: JobRow[] = await db.select(`SELECT ${cols.join(', ')} FROM kite_jobs`);
  convertTimestamps(jobs);
  failHopelessJobs(jobs);
  deleteOldJobs(jobs);

  const working = getWorking(jobs);
  if (working.length) {
    res.status(204).end();
    return;
  }

  let give = jobs.filter(statusIs('queued')).sort(oldestFirst)[0];

  give =
    give ||
    jobs
      .filter(statusIs('in_progress'))
      .filter(({ attempts }) => attempts < 3)
      .filter(isStale)
      .sort(oldestFirst)[0];

  if (!give) {
    res.status(204).end();
    return;
  }

  await db.query(
    'UPDATE kite_jobs SET status = ?, attempts = ?, updated_at = ? WHERE id = ?',
    ['in_progress', give.attempts + 1, new Date(), give.id],
  );

  // `job` col can be huge, so avoid loading it into memory and processing it until
  // we know that we have a job we want to give out, which is rare
  const [{ job }] = await db.select('SELECT job FROM kite_jobs where id = ?', [give.id]);

  res.json({
    id: give.id,
    upload_path: give.upload_path,
    job,
  });
}

function getWorking(jobs: JobRow[]) {
  return jobs
    .filter(statusIs('in_progress'))
    .filter(({ attempts }) => attempts < 3)
    .filter(notStale);
}

function failHopelessJobs(jobs: JobRow[]) {
  jobs
    .filter(statusIs('in_progress'))
    .filter(isStale)
    .filter(({ attempts }) => attempts > 2)
    .forEach(job => {
      db.query('UPDATE `kite_jobs` SET `status` = ?, `updated_at` = ? WHERE `id` = ?', [
        'failed',
        new Date(),
        job.id,
      ]);
      job.status = 'failed';
    });
}

function deleteOldJobs(jobs: JobRow[]) {
  jobs.filter(isOld).forEach(({ id }) => {
    db.query('DELETE FROM kite_jobs where id = ?', id);
  });
}

function convertTimestamps(jobs: JobRow[]) {
  jobs.forEach(job => {
    job.created_at = moment(job.created_at);
    job.updated_at = moment(job.updated_at);
  });
}

function statusIs(status: JobRow['status']): (job: JobRow) => boolean {
  return job => job.status === status;
}

function notStale({ updated_at }: JobRow) {
  return updated_at.isAfter(moment().subtract(10, 'minutes'));
}

function isStale({ updated_at }: JobRow) {
  return updated_at.isBefore(moment().subtract(10, 'minutes'));
}

function isOld({ updated_at }: JobRow) {
  return updated_at.isBefore(moment().subtract(1.5, 'hours'));
}

function oldestFirst(a: JobRow, b: JobRow) {
  return a.created_at.isBefore(b.created_at) ? -1 : 1;
}
