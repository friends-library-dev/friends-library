// @flow
import fs from 'fs-extra';
import { resolve as pathResolve } from 'path';
import sass from 'node-sass';
import { memoize } from 'lodash';
import type { Css } from '../type';

export const file = memoize((path: string): string => {
  return fs.readFileSync(pathResolve(__dirname, path)).toString();
});

export const toCss = memoize((path: string): Css => {
  return sass.renderSync({
    data: file(path),
  }).css.toString();
});

export const PUBLISH_DIR: string = pathResolve(__dirname, '../../_publish');
