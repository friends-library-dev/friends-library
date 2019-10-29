import env from '@friends-library/env';
import { Url, isDefined } from '@friends-library/types';
import * as AWS from 'aws-sdk';
import fs from 'fs-extra';
import { extname } from 'path';

type LocalFilePath = string;
type CloudFilePath = string;

let clientInstance: AWS.S3;

function getClient(): AWS.S3 {
  if (!clientInstance) {
    const {
      CLOUD_STORAGE_ENDPOINT,
      CLOUD_STORAGE_KEY,
      CLOUD_STORAGE_SECRET,
    } = env.require(
      'CLOUD_STORAGE_ENDPOINT',
      'CLOUD_STORAGE_KEY',
      'CLOUD_STORAGE_SECRET',
    );
    clientInstance = new AWS.S3({
      endpoint: new AWS.Endpoint(CLOUD_STORAGE_ENDPOINT).href,
      credentials: new AWS.Credentials({
        accessKeyId: CLOUD_STORAGE_KEY,
        secretAccessKey: CLOUD_STORAGE_SECRET,
      }),
    });
  }

  return clientInstance;
}

export async function uploadFile(
  localFilePath: LocalFilePath,
  cloudFilePath: CloudFilePath,
  opts: { delete: boolean } = { delete: false },
): Promise<Url> {
  const { CLOUD_STORAGE_BUCKET_URL, CLOUD_STORAGE_BUCKET } = env.require(
    'CLOUD_STORAGE_BUCKET_URL',
    'CLOUD_STORAGE_BUCKET',
  );
  const client = getClient();
  return new Promise((resolve, reject) => {
    client.putObject(
      {
        Key: cloudFilePath,
        Body: fs.readFileSync(localFilePath),
        Bucket: CLOUD_STORAGE_BUCKET,
        ContentType: getContentType(localFilePath),
        ACL: 'public-read',
      },
      err => {
        if (err) {
          reject(err);
          return;
        }
        if (opts.delete) {
          fs.removeSync(localFilePath);
        }
        resolve(`${CLOUD_STORAGE_BUCKET_URL}/${cloudFilePath}`);
      },
    );
  });
}

export async function uploadFiles(
  files: Map<LocalFilePath, CloudFilePath>,
  opts: { delete: boolean } = { delete: false },
): Promise<Url[]> {
  const { CLOUD_STORAGE_BUCKET_URL } = env.require('CLOUD_STORAGE_BUCKET_URL');
  const promises = [...files].map(([localPath, cloudPath]) =>
    uploadFile(localPath, cloudPath, opts),
  );

  return Promise.all(promises).then(() => {
    return [...files.values()].map(
      cloudPath => `${CLOUD_STORAGE_BUCKET_URL}/${cloudPath}`,
    );
  });
}

export async function rimraf(path: CloudFilePath): Promise<CloudFilePath[]> {
  const { CLOUD_STORAGE_BUCKET } = env.require('CLOUD_STORAGE_BUCKET');
  const client = getClient();
  // note, in `aws-sdk` v3 (now in alpha), it looks like they
  // switched to allowing `const data = await client.operation(...)`
  // so, should switch when released to avoid these shenanigans
  return new Promise((resolve, reject) => {
    client.listObjects(
      {
        Bucket: CLOUD_STORAGE_BUCKET,
        Prefix: path,
      },
      (listErr, listData) => {
        if (listErr) {
          reject(listErr);
          return;
        }
        client.deleteObjects(
          {
            Bucket: CLOUD_STORAGE_BUCKET,
            Delete: {
              Objects: (listData.Contents || [])
                .map(({ Key }) => Key)
                .filter(isDefined)
                .map(Key => ({ Key })),
            },
          },
          (deleteErr, deleteData) => {
            if (deleteErr) {
              reject(deleteErr);
              return;
            }
            resolve((deleteData.Deleted || []).map(({ Key }) => Key).filter(isDefined));
          },
        );
      },
    );
  });
}

function getContentType(path: LocalFilePath): string {
  switch (extname(path)) {
    case '.pdf':
      return 'application/pdf';
    case '.epub':
      return 'application/epub+zip';
    case '.mobi':
      return 'application/x-mobipocket-ebook';
    default:
      throw new Error(`Unexpected file extension: ${path}`);
  }
}
