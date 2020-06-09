import { Octokit } from '@octokit/rest';
import env from '@friends-library/env';
import { EditionMeta } from '@friends-library/types';
import DocumentMeta from './document-meta';

export async function fetch(): Promise<DocumentMeta> {
  const { GIST_ID, GIST_FILENAME } = envVars();
  const { data } = await getClient().gists.get({ gist_id: GIST_ID });
  // @ts-ignore
  const editions = JSON.parse(data.files[GIST_FILENAME].content);
  return new DocumentMeta(editions);
}

let meta: DocumentMeta | null;
let metaPromise: Promise<DocumentMeta> | null;

export async function fetchSingleton(): Promise<DocumentMeta> {
  if (meta) {
    return meta;
  }

  if (metaPromise) {
    return metaPromise;
  }

  metaPromise = fetch().then(fetched => {
    meta = fetched;
    return meta;
  });

  return metaPromise;
}

export async function save(meta: DocumentMeta): Promise<boolean> {
  const data = [...meta].reduce((acc, [id, editionMeta]) => {
    acc[id] = editionMeta;
    return acc;
  }, {} as Record<string, EditionMeta>);
  const { GIST_ID, GIST_FILENAME } = envVars();
  try {
    await getClient().gists.update({
      gist_id: GIST_ID,
      // @ts-ignore
      files: {
        [GIST_FILENAME]: {
          content: JSON.stringify(data, null, 2),
        },
      },
    });
    return true;
  } catch {
    return false;
  }
}

function getClient(): Octokit {
  const { AUTH_TOKEN } = envVars();
  return new Octokit({ auth: `token ${AUTH_TOKEN}` });
}

function envVars(): { GIST_ID: string; GIST_FILENAME: string; AUTH_TOKEN: string } {
  const {
    DOCUMENT_META_AUTH_TOKEN,
    DOCUMENT_META_GIST_ID,
    DOCUMENT_META_GIST_FILENAME,
  } = env.require(
    `DOCUMENT_META_AUTH_TOKEN`,
    `DOCUMENT_META_GIST_ID`,
    `DOCUMENT_META_GIST_FILENAME`,
  );
  return {
    GIST_ID: DOCUMENT_META_GIST_ID,
    GIST_FILENAME: DOCUMENT_META_GIST_FILENAME,
    AUTH_TOKEN: DOCUMENT_META_AUTH_TOKEN,
  };
}
