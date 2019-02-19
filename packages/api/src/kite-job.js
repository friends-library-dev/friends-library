// @flow
import uuid from 'uuid/v4';
import moment from 'moment';
import type { $Request, $Response } from 'express';
import * as db from './db';

export async function create(req: $Request, res: $Response) {
  const body = ((req.body: any): {| job: Object, uploadPath: string |});
  if (typeof body.uploadPath !== 'string' || typeof body.job !== 'object') {
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
    res.status(500).send();
  }
}

export async function get(req: $Request, res: $Response) {
  const { params: { id } } = req;
  const results = await db.select('SELECT id, status, url from `kite_jobs` WHERE id = ?', [id]);
  if (!results.length) {
    res.status(404).send();
    return;
  }
  res.send(results[0]);
}

export async function update(req: $Request, res: $Response) {
  const { params: { id } } = req;
  const results = await db.select('SELECT id FROM `kite_jobs` WHERE id = ?', [id]);
  if (!results.length) {
    res.status(404).send();
    return;
  }

  const body = ((req.body: any): Object);
  const fillable = ['status', 'url'];
  let sets = ['`updated_at` = ?'];
  let params = [new Date()];
  fillable.forEach(column => {
    if (body[column]) {
      sets.push(`\`${column}\` = ?`);
      params.push(body[column]);
    }
  });

  await db.query(
    `UPDATE kite_jobs SET ${sets.join(', ')} WHERE id = ?`,
    [...params, id],
  );

  res.json({ id });
}


export async function take(req: $Request, res: $Response) {
  const cols = [
    'id',
    'attempts',
    'upload_path',
    'status',
    'job',
    'created_at',
    'updated_at',
  ];

  const jobs = await db.select(`SELECT ${cols.join(', ')} FROM kite_jobs`);
  convertTimestamps(jobs);
  failHopelessJobs(jobs);

  const inProgress = jobs
    .filter(({ status }) => status === 'in_progress')
    .filter(({ attempts }) => attempts < 3)
    .filter(notStale)

  if (inProgress.length) {
    res.status(204).end();
    return;
  }

  let give = jobs
    .filter(({ status }) => status === 'queued')
    .sort(oldestFirst)[0];

  give = give || jobs
    .filter(({ status }) => status === 'in_progress')
    .filter(({ attempts }) => attempts < 3)
    .filter(isStale)
    .sort(oldestFirst)[0];

  if (!give) {
    res.status(204).end();
    return;
  }

  // await db.query(
  //   'UPDATE kite_jobs SET status = ?, attempts = ?, updated_at = ? WHERE id = ?',
  //   ['in_progress', give.attempts + 1, new Date(), give.id],
  // );

  res.json({
    id: give.id,
    upload_path: give.upload_path,
    job: give.job,
  });
}

function failHopelessJobs(jobs) {
  jobs
    .filter(({ status }) => status === 'in_progress')
    .filter(isStale)
    .filter(({ attempts }) => attempts > 2)
    .forEach(job => {
      db.query(
        'UPDATE `kite_jobs` SET `status` = ?, `updated_at` = ? WHERE `id` = ?',
        ['failed', new Date(), job.id],
      );
      job.status = 'failed';
    });
}

function convertTimestamps(jobs) {
  jobs.forEach(job => {
    job.created_at = moment(job.created_at);
    job.updated_at = moment(job.updated_at);
  });
}

function notStale({ updated_at }) {
  return updated_at.isAfter(moment().subtract(7, 'minutes'));
}

function isStale({ updated_at }) {
  return updated_at.isBefore(moment().subtract(7, 'minutes'));
}

function oldestFirst(a, b) {
  return a.created_at.isBefore(b.created_at) ? -1 : 1;
}
