import { log } from '@friends-library/slack';
import Orders from './Orders';
import Downloads from './Downloads';
import { Db } from './types';

export default class Client {
  orders: Orders;
  downloads: Downloads;

  public constructor(private secret: string) {
    this.orders = new Orders(this);
    this.downloads = new Downloads(this);
  }

  public async sendQuery<T>(
    query: string,
    variables: Record<string, any> = {},
  ): Promise<[Db.QueryError, null | T]> {
    try {
      const res = await fetch(`https://graphql.fauna.com/graphql`, {
        method: `POST`,
        headers: { Authorization: `Bearer ${this.secret}` },
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
}
