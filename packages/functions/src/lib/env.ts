import { Environment } from '@friends-library/types';
import baseEnv from '@friends-library/env';

let context: Environment = `production`;

export default function env(key: string): string {
  if (context === `production`) {
    const prodKey = `PROD_${key}`;
    const prodValue = baseEnv.get(prodKey)[prodKey];
    if (prodValue !== ``) return prodValue;
  }

  if (context === `staging`) {
    const testKey = `TEST_${key}`;
    const testValue = baseEnv.get(testKey)[testKey];
    if (testValue !== ``) return testValue;
  }

  return baseEnv.require(key)[key];
}

env.getContext = function (): Environment {
  return context;
};

env.setContext = function (lambdaContext?: {
  clientContext?: { custom?: { netlify?: string } };
}): void {
  const encoded = lambdaContext?.clientContext?.custom?.netlify;
  if (encoded === undefined) {
    return;
  }
  const str = Buffer.from(encoded, `base64`).toString(`utf-8`);
  try {
    const json = JSON.parse(str);
    if (typeof json === `object` && typeof json?.site_url === `string`) {
      context = (json.site_url as string).includes(`netlify`) ? `staging` : `production`;
    }
  } catch {
    // ¯\_(ツ)_/¯
  }
};
