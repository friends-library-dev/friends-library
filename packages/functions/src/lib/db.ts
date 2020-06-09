import '@friends-library/env/load';
import fetch from 'node-fetch';
import env from './env';
import log from './log';

export type QueryError = null | string[];

export async function sendQuery<T>(
  query: string,
  variables: Record<string, any> = {},
): Promise<[QueryError, null | T]> {
  try {
    const res = await fetch(`https://graphql.fauna.com/graphql`, {
      method: `POST`,
      headers: { Authorization: `Bearer ${env(`FAUNA_SERVER_SECRET`)}` },
      body: JSON.stringify({ query, variables }),
    });

    const json = await res.json();
    if (json.errors || !json.data) {
      log.error(`graphql error`, { json, query, variables });
    }

    return [
      json.errors ? json.errors.map((e: { message: string }) => e.message) : null,
      json.data ? json.data.result : null,
    ];
  } catch (error) {
    const msg = error instanceof Error ? error.message : `faunadb http/unknown error`;
    return [[msg], null];
  }
}
