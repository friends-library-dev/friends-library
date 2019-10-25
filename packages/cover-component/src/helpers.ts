import React from 'react';
import { Html } from '@friends-library/types';
import { quotify } from '@friends-library/adoc-utils';

export function overridable(
  key: string,
  fragments: Record<string, Html>,
  fallback: JSX.Element,
): JSX.Element {
  if (fragments[key] !== undefined) {
    return React.createElement(key === 'blurb' ? 'div' : fallback.type, {
      className: key,
      dangerouslySetInnerHTML: { __html: fragments[key] },
    });
  }
  return fallback;
}

export function initials(author: string): [string, string] {
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}

export function prepareTitle(title: string, name: string): string {
  title = title.replace(/--/g, '–');
  title = title.replace(/ – Volumen? (?<number>(\d+|[IV]+))/, ', Vol.&nbsp;$<number>');
  return title.replace(name, name.replace(/ /g, '&nbsp;'));
}

export function formatBlurb(blurb: string): string {
  return quotify(blurb)
    .replace(/"`/g, '“')
    .replace(/`"/g, '”')
    .replace(/'`/g, '‘')
    .replace(/`'/g, '’')
    .replace(/--/g, '–');
}
