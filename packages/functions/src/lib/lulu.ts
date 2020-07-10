import { LuluClient } from '@friends-library/lulu';
import env from './env';

export default function client(): LuluClient {
  return new LuluClient({
    clientKey: env(`LULU_CLIENT_KEY`),
    clientSecret: env(`LULU_CLIENT_SECRET`),
    sandbox: env(`LULU_API_ENDPOINT`).includes(`sandbox`),
  });
}
