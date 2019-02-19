// @flow
/* istanbul ignore file */
import AWS from 'aws-sdk';
import fs from 'fs-extra';
import type { Url } from '../../../type';

const { env: {
  CLOUD_STORAGE_ENDPOINT,
  CLOUD_STORAGE_KEY,
  CLOUD_STORAGE_SECRET,
  CLOUD_STORAGE_BUCKET_URL,
  CLOUD_STORAGE_BUCKET,
} } = process;

type LocalFilePath = string;
type CloudFilePath = string;

let clientInstance;

function getClient() {
  if (!clientInstance) {
    clientInstance = new AWS.S3({
      endpoint: new AWS.Endpoint(CLOUD_STORAGE_ENDPOINT),
      credentials: new AWS.Credentials({
        accessKeyId: CLOUD_STORAGE_KEY,
        secretAccessKey: CLOUD_STORAGE_SECRET,
      }),
    });
  }

  return clientInstance;
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
      Bucket: CLOUD_STORAGE_BUCKET,
      Prefix: path,
    }, (listErr, listData) => {
      if (listErr) {
        reject(new Error(listErr));
        return;
      }
      client.deleteObjects({
        Bucket: CLOUD_STORAGE_BUCKET,
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

export async function uploadFile(
  localFilePath: LocalFilePath,
  cloudFilePath: CloudFilePath,
  opts?: { delete: boolean } = { delete: false },
): Promise<Url> {
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.putObject({
      Key: cloudFilePath,
      Body: fs.readFileSync(localFilePath),
      Bucket: CLOUD_STORAGE_BUCKET,
      ContentType: 'application/pdf', // @TODO not hard-coded
      ACL: 'public-read',
    }, (err) => {
      if (err) {
        reject(new Error(err));
        return;
      }
      if (opts.delete) {
        fs.removeSync(localFilePath);
      }
      resolve(`${CLOUD_STORAGE_BUCKET_URL || ''}/${cloudFilePath}`);
    });
  });
}

export async function uploadFiles(
  files: Map<CloudFilePath, LocalFilePath>,
  opts?: { delete: boolean } = { delete: false },
): Promise<Array<Url>> {
  const promises = [...files.entries()]
    .map(([cloudPath, localPath]) => uploadFile(cloudPath, localPath, opts));

  return Promise.all(promises)
    .then(() => {
      return [...files.keys()]
        .map(cloudPath => `${CLOUD_STORAGE_BUCKET_URL || ''}/${cloudPath}`);
    });
}
