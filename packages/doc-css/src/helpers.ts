import fs from 'fs';
import { Css, DocPrecursor } from '@friends-library/types';

export function joinCssFiles(paths: string[]): Css {
  return paths.map(toCss).join(`\n`);
}

export function replaceVars(css: Css, vars: Record<string, string>): Css {
  return css.replace(/var\((--[^)]+)\)/g, (_, varId) => {
    return vars[varId];
  });
}

export function toCss(relPath: string): Css {
  // going all the way up to root allows this to work for ncc-bundled actions
  // which are in the same directory depth, but a different location
  const ROOT = `${__dirname}/../../..`;
  return fs.readFileSync(`${ROOT}/packages/doc-css/src/css/${relPath}.css`).toString();
}

export function runningHead(dpc: DocPrecursor): string {
  const { sections, meta, config } = dpc;
  return sections.length === 1 ? meta.author.name : config.shortTitle || meta.title;
}
