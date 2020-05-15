import { EditionType, AudioQuality, syntax as graphql } from '@friends-library/types';
import { sendQuery, QueryError } from './db';

export interface Download {
  documentId: string;
  edition: EditionType;
  format: string;
  isMobile: boolean;
  created: string;
  audioQuality?: AudioQuality;
  audioPartNumber?: number;
  os?: string;
  browser?: string;
  platform?: string;
  userAgent?: string;
  referrer?: string;
  ip?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export async function create(download: Download): Promise<[QueryError, boolean]> {
  const [errors] = await sendQuery(CREATE_DOWNLOAD, { data: download });
  return [errors, !errors];
}

const CREATE_DOWNLOAD = graphql`
  mutation CreateDownload($data: DownloadInput!) {
    result: createDownload(data: $data) {
      _id
    }
  }
`;
