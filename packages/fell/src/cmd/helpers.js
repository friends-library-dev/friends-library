// @flow

export function relPath(path: string): string {
  return path.replace(`${process.cwd()}/`, '');
}

export const excludable = {
  exclude: {
    alias: 'x',
    default: [],
    type: 'array',
  },
};

export const scopeable = {
  scope: {
    type: 'string',
  },
};

export const forceable = {
  force: {
    alias: 'f',
    default: false,
    type: 'boolean',
  },
};
