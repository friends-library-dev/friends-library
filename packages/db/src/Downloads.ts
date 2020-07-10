import { syntax as graphql } from '@friends-library/types';
import { Db } from './types';
import Client from './Client';

export default class Downloads {
  public constructor(private client: Client) {}

  public async create(download: Db.Download): Promise<[Db.QueryError, boolean]> {
    const [errors] = await this.client.sendQuery(CREATE_DOWNLOAD, { data: download });
    return [errors, !errors];
  }
}

const CREATE_DOWNLOAD = graphql`
  mutation CreateDownload($data: DownloadInput!) {
    result: createDownload(data: $data) {
      _id
    }
  }
`;
