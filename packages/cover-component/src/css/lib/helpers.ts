import cx from 'classnames';
import { CoverProps } from '@friends-library/types';

/**
 * An identity pass-through tagged template literal function
 * just so I can get syntax highlighting etc. from vscode
 */
export function css(strings: any, ...values: any[]): string {
  let str = '';
  strings.forEach((string: string, i: number) => {
    str += string + (values[i] || '');
  });
  return str;
}

export function wrapClasses(
  { edition, lang, size }: CoverProps,
  customClasses?: string | string[] | Record<string, boolean>,
): string {
  return cx(
    'Cover',
    `Edition--${edition}`,
    `Lang--${lang}`,
    `trim--${size}`,
    customClasses,
  );
}
