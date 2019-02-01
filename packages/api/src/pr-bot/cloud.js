// @flow
/* istanbul ignore file */
import AWS from 'aws-sdk';
import fs from 'fs-extra';
import type { Url } from '../../../../type';

const { env: {
  S3_ENDPOINT,
  S3_KEY,
  S3_SECRET,
  S3_BUCKET_URL,
} } = process;

type LocalFilePath = string;
type CloudFilePath = string;

function getClient() {
  return new AWS.S3({
    endpoint: new AWS.Endpoint(S3_ENDPOINT),
    credentials: new AWS.Credentials({
      accessKeyId: S3_KEY,
      secretAccessKey: S3_SECRET,
    }),
  });
}

export async function rimraf(
  path: CloudFilePath,
): Promise<Array<CloudFilePath>> {
  const client = getClient();
  // note, in `aws-sdk` v3 (now in alpha), it looks like they
  // switched to allowing `const data = await client.operation(...)`
  // so, should switch when released to avoid these shenanigans
  return new Promise((resolve, reject) => {
    client.listObjects({
      Bucket: 'friends-library-assets',
      Prefix: path,
    }, (listErr, listData) => {
      if (listErr) {
        reject(new Error(listErr));
        return;
      }
      client.deleteObjects({
        Bucket: 'friends-library-assets',
        Delete: {
          Objects: listData.Contents.map(({ Key }) => ({ Key })),
        },
      }, (deleteErr, deleteData) => {
        if (deleteErr) {
          reject(new Error(deleteErr));
          return;
        }
        resolve(deleteData.Deleted.map(({ Key }) => Key));
      });
    });
  });
}

export async function uploadFiles(
  files: Map<CloudFilePath, LocalFilePath>,
  opts?: { delete: boolean } = { delete: false },
): Promise<Array<Url>> {
  const client = getClient();
  const promises = [...files.entries()].map(([Key, path]) => {
    return new Promise((resolve, reject) => {
      client.putObject({
        Key,
        Body: fs.readFileSync(path),
        Bucket: 'friends-library-assets',
        ContentType: 'application/pdf',
        ACL: 'public-read',
      }, (err) => {
        if (err) {
          reject(new Error(err));
          return;
        }
        if (opts.delete) {
          fs.removeSync(path);
        }
        resolve();
      });
    });
  });

  return Promise.all(promises)
    .then(() => {
      return [...files.keys()]
        .map(Key => `${S3_BUCKET_URL || ''}/${Key}`);
    });
}
