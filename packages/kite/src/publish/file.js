// @flow
import fs from 'fs-extra';
import sass from 'node-sass';
import { memoize } from 'lodash';
import type { Css } from '../type';

export const file = memoize((path: string): string => {
  return fs.readFileSync(`src/publish/${path}`).toString();
});

export const toCss = memoize((path: string): Css => {
  return sass.renderSync({
    data: file(path),
  }).css.toString();
});
