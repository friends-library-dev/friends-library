import React from 'react';
import { toRoman } from 'roman-numerals';
import { Html, Lang } from '@friends-library/types';
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

export function initials(
  author: string,
  title: string,
  lang: Lang,
  isCompilation: boolean,
): [string, string] {
  if (isCompilation) {
    if (title.includes('Piety Promoted')) {
      return ['P', 'P'];
    }
    // [F]riends [L]ibrary || [B]iblioteca [A]migos
    return lang === 'en' ? ['F', 'L'] : ['B', 'A'];
  }
  const [first, ...rest] = author.split(' ');
  return [first[0].toUpperCase(), rest[rest.length - 1][0].toUpperCase()];
}

export function prepareTitle(
  title: string,
  name: string,
  context: 'front' | 'spine',
): string {
  const isCompilation = ['Compilations', 'Compilaciones'].includes(name);
  const volumeRemovable = isCompilation || title.includes(name);
  title = title.replace(/--/g, '–');
  title = title.replace(/(?: –|,) Vol(?:\.|umen?) (\d+|[IV]+)$/, (_, num) =>
    context === 'front' && volumeRemovable ? '' : `, Vol.&nbsp;${ensureRoman(num)}`,
  );
  return title.replace(name, name.replace(/ /g, '&nbsp;'));
}

export function prepareAuthor(
  author: string,
  title: string,
  isCompilation: boolean,
  lang: Lang,
): string {
  const volumeMatch = title.match(/ Vol(?:\.|umen?) (\d+|[IV]+)$/);
  const nameInTitle = title.includes(author);
  if (!volumeMatch && isCompilation) {
    return lang === 'en' ? 'Friends Library' : 'Biblioteca de los Amigos';
  }
  if (volumeMatch && (nameInTitle || isCompilation)) {
    return `Volume${lang === 'es' ? 'n' : ''} ${ensureRoman(volumeMatch[1])}`;
  }
  return author;
}

function ensureRoman(str: string): string {
  return str.match(/^\d+$/) ? toRoman(Number(str)) : str;
}

export function formatBlurb(blurb: string): string {
  return quotify(blurb)
    .replace(/"`/g, '“')
    .replace(/`"/g, '”')
    .replace(/'`/g, '‘')
    .replace(/`'/g, '’')
    .replace(/--/g, '–');
}

export function getHtmlFragments(html: Html): Record<string, Html> {
  const fragments: Record<string, Html> = {};
  const regex = /(?:^|\n)<(div|p|h\d).+?\n<\/\1>/gs;
  let match;
  while ((match = regex.exec(html))) {
    const lines = match[0]
      .trim()
      .split('\n')
      .map(s => s.trim());
    lines.pop();
    const classMatch = (lines.shift() || '').match(/class="([^ "]+)/);
    if (classMatch) {
      fragments[classMatch[1]] = lines.join('');
    } else {
      console.error(`Bad custom HTML -- frag wrapping elements must have class`);
    }
  }
  return fragments;
}
