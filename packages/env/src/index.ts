function getEnv<T extends string>(required: boolean, ...keys: T[]): { [k in T]: string } {
  /* eslint-disable @typescript-eslint/no-object-literal-type-assertion */
  const obj = {} as { [k in T]: string };
  keys.forEach(key => {
    let val = process.env[key];
    if (required && typeof val !== 'string') {
      throw new Error(`Env var \`${key}\` is required.`);
    }
    obj[key] = typeof val === 'string' ? val : '';
  });
  return obj;
}

const get: <T extends string>(...keys: T[]) => { [k in T]: string } = (...keys) => {
  return getEnv(false, ...keys);
};

const req: <T extends string>(...keys: T[]) => { [k in T]: string } = (...keys) => {
  return getEnv(true, ...keys);
};

export default {
  get,
  require: req,
};
