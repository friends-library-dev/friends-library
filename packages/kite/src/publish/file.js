// @flow
import fs from 'fs-extra';
import { resolve as pathResolve } from 'path';
import sass from 'node-sass';
import { memoize } from 'lodash';
import type { Css } from '../type';

export const file = memoize((path: string): string => {
  return fs.readFileSync(pathResolve(__dirname, path)).toString();
});

export const toCss = memoize((path: string, vars: { [string]: string } = {}): Css => {
  const sassVars = Object.keys(vars).map(name => `$${name}: ${vars[name]};`).join('\n');
  return sass.renderSync({
    data: `${sassVars}\n${file(path)}`,
  }).css.toString().replace(/^@charset "UTF-8";\n/gm, '');
});

export const PUBLISH_DIR: string = pathResolve(__dirname, '../../_publish');
