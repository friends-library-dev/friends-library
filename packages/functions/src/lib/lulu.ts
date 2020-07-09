import { LuluClient } from '@friends-library/lulu';
import env from './env';

export default function client(): LuluClient {
  const clientId = 'e449e732-00f2-4ade-af50-0a6066e97fb0';
  const clientSecret = 'ec1f318a-c144-4df1-b080-a114d2e4d500';
  return new LuluClient({
    // clientKey: clientId,
    // clientSecret,
    // sandbox: false,
    clientKey: env(`LULU_CLIENT_KEY`),
    clientSecret: env(`LULU_CLIENT_SECRET`),
    sandbox: env(`LULU_API_ENDPOINT`).includes('sandbox'),
  });
}
