// @flow
import uuid from 'uuid/v4';
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
  const results = await db.select('SELECT id, status, url from `kite_jobs` where id = ?', [id]);
  if (!results.length) {
    res.status(404).send();
    return;
  }
  res.send(results[0]);
}


export async function take(req: $Request, res: $Response) {

  // ~~ 1 ~~ abandon hopeless stale jobs
  // fetch all `in_progress` jobs
  // if any have been attempted 3 times, and are older than STALE_TIME, update them to `failed`

  // ~~ 2 ~~ don't give job if we're working on one
  // if we have one less than STALE_TIME, then return EMPTY -- system is working on one. - QUIT

  // ~~ 3 ~~ give oldest `queued` job (prioritize new jobs over re-trying stale ones)
  // select all the `queued` jobs, if we have some, give the oldest and QUIT

  // ~~ 4 ~~ retry stale (but not hopeless) jobs
  // using fetched stale jobs from step 1
  // if we have some older than STALE_TIME and less than 3 attempts, return oldest by `created_at`- QUIT

  // ~~ 5 ~~ nothing to see here, move right along
  // QUIT

  res.json(['take!']);
}
