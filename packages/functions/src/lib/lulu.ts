import ClientOAuth2 from 'client-oauth2';
import { PrintSize } from '@friends-library/types';
import env from './env';

export function podPackageId(printSize: PrintSize, numPages: number): string {
  const dimensions = {
    s: `0425X0687`,
    m: `0550X0850`,
    xl: `0600X0900`,
  };

  return [
    dimensions[printSize],
    `BW`, // interior color
    `STD`, // standard quality
    numPages < 32 ? `SS` : `PB`, // saddle-stitch || perfect bound
    `060UW444`, // 60# uncoated white paper, bulk = 444 pages/inch
    `G`, // glossy cover (`M`: matte)
    `X`, // no linen,
    `X`, // no foil
  ].join(``);
}

export async function getAuthToken(): Promise<string> {
  const ENDPOINT = env(`LULU_API_ENDPOINT`);
  const client = new ClientOAuth2({
    clientId: env(`LULU_CLIENT_KEY`),
    clientSecret: env(`LULU_CLIENT_SECRET`),
    accessTokenUri: `${ENDPOINT}/auth/realms/glasstree/protocol/openid-connect/token`,
  });

  const { accessToken } = await client.credentials.getToken();

  return accessToken;
}
