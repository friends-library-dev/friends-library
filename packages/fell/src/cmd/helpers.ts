import { Options } from 'yargs';

export function relPath(path: string): string {
  return path.replace(`${process.cwd()}/`, ``);
}

export const excludable: { exclude: Options } = {
  exclude: {
    alias: `x`,
    default: [],
    type: `array`,
  },
};

export const scopeable: { scope: Options } = {
  scope: {
    type: `string`,
  },
};

export const forceable: { force: Options } = {
  force: {
    alias: `f`,
    default: false,
    type: `boolean`,
  },
};
