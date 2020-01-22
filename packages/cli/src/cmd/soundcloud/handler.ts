import env from '@friends-library/env';
import Client from './SoundCloudClient';

export default async function handler(): Promise<void> {
  const client = getClient();
  console.log(typeof client);
}

function getClient(): Client {
  const {
    SOUNDCLOUD_USERNAME,
    SOUNDCLOUD_PASSWORD,
    SOUNDCLOUD_CLIENT_ID,
    SOUNDCLOUD_CLIENT_SECRET,
  } = env.require(
    'SOUNDCLOUD_USERNAME',
    'SOUNDCLOUD_PASSWORD',
    'SOUNDCLOUD_CLIENT_ID',
    'SOUNDCLOUD_CLIENT_SECRET',
  );

  return new Client({
    username: SOUNDCLOUD_USERNAME,
    password: SOUNDCLOUD_PASSWORD,
    clientId: SOUNDCLOUD_CLIENT_ID,
    clientSecret: SOUNDCLOUD_CLIENT_SECRET,
  });
}
