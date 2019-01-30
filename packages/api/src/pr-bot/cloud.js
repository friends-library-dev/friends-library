// @flow
/* istanbul ignore file */
import AWS from 'aws-sdk';
import fs from 'fs';
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
    })
  });
}

export async function uploadFiles(
  files: Map<CloudFilePath, LocalFilePath>,
): Promise<Array<Url>> {
  const client = getClient();
  const promises = [...files.entries()].map(([Key, path]) => {
    return client.putObject({
      Key,
      Body: fs.readFileSync(path),
      Bucket: 'friends-library-assets',
      ContentType: 'application/pdf',
      ACL: 'public-read',
    }).send();
  });

  return await Promise.all(promises)
    .then(() => {
      return [...files.keys()]
        .map(Key => `${S3_BUCKET_URL || ''}/${Key}`);
    });
}
