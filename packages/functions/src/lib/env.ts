import baseEnv from '@friends-library/env';

let context: 'TEST' | 'PROD' = `PROD`;

export default function env(key: string): string {
  if (context === `PROD`) {
    const prodKey = `PROD_${key}`;
    const prodValue = baseEnv.get(prodKey)[prodKey];
    if (prodValue !== ``) return prodValue;
  }

  if (context === `TEST`) {
    const testKey = `TEST_${key}`;
    const testValue = baseEnv.get(testKey)[testKey];
    if (testValue !== ``) return testValue;
  }

  return baseEnv.require(key)[key];
}

env.getContext = function(): 'TEST' | 'PROD' {
  return context;
};

env.setContext = function(lambdaContext?: {
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
      context = (json.site_url as string).includes(`netlify`) ? `TEST` : `PROD`;
    }
  } catch {
    // ¯\_(ツ)_/¯
  }
};
