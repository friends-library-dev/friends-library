import fs from 'fs';
import { Css } from '@friends-library/types';

export function joinCssFiles(paths: string[]): Css {
  return paths.map(toCss).join('\n');
}

export function replaceVars(css: Css, vars: Record<string, string>): Css {
  return css.replace(/var\((--[^\)]+)\)/g, (_, varId) => {
    return vars[varId];
  });
}
export function toCss(relPath: string): Css {
  return fs.readFileSync(`${__dirname}/../src/css/${relPath}.css`).toString();
}
