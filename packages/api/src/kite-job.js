// @flow
import uuid from 'uuid/v4';
import type { $Request, $Response } from 'express';
import * as db from './db';

export async function create(req: $Request, res: $Response) {
  console.log('POST /kite-job');
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
  console.log(`GET /${id}`);
  const results = await db.select('SELECT id, status, url from `kite_jobs` where id = ?', [id]);
  if (!results.length) {
    res.status(404).send();
    return;
  }
  res.send(results[0]);
}
