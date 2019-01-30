// @flow
/* eslint-disable no-continue */
import type { Asciidoc } from '../../../../type';

export default function quotify(adoc: Asciidoc): Asciidoc {
  return adoc.split('\n').map(quotifyLine).join('\n');
}

function quotifyLine(line: Asciidoc): Asciidoc {
  if (line === "'''") {
    return line;
  }

  if (line.match(/^\[.+\]$/)) {
    return line;
  }

  let match;
  const chars = line.split('');
  const mod = [...chars];
  const expr = /"|'/g;

  while ((match = expr.exec(line))) {
    const type = match[0];
    const { index } = match;

    if (chars[index - 1] === BACKTICK || chars[index + 1] === BACKTICK) {
      continue;
    }

    if (index === 0) {
      mod[0] = right(type);
      continue;
    }

    const before = line.substring(0, index);
    const after = line.substring(index + 1);
    const charBefore = before[index - 1];
    const charAfter = after[0];

    // in the middle of a word like `don't`? point left
    if (
      (charBefore && charBefore.match(/[a-z0-9]/i))
      && (charAfter && charAfter.match(/[a-z,;:.]/i))
    ) {
      // continue; // comment out to segregate possessive fixes
      mod[index] = left(type);
      continue;
    }

    // if there is a space before it, always point it right
    if (charBefore === ' ') {
      mod[index] = right(type);
      continue;
    }

    // if there is a space after it, always point left
    if (charAfter === ' ') {
      mod[index] = left(type);
      continue;
    }

    // at the end of the line? point left
    if (index === line.length - 1) {
      mod[index] = left(type);
      continue;
    }

    if (['?', '.', ','].includes(charBefore)) {
      mod[index] = left(type);
      continue;
    }

    // fallthrough
    mod[index] = right(type);
  }

  return mod.join('');
}

function right(type: string): string {
  return `${type}${BACKTICK}`;
}

function left(type: string): string {
  return `${BACKTICK}${type}`;
}

const BACKTICK = '`';
