import cx from 'classnames';
import { CoverProps, PrintSize, Css } from '@friends-library/types';
import { sizes as bookSizes } from '@friends-library/lulu';

export function docDims(
  size: PrintSize,
  pages: number,
  scaler?: number,
): Record<string, number> {
  const { width, height } = bookSizes[size].dims;
  const spinePad = 0.06;
  const pagesPerInch = 444;
  const threeDSpineWidth = spinePad + pages / pagesPerInch;
  const pdfSpineWidth = pages < 32 ? 0 : threeDSpineWidth;
  return {
    width,
    height,
    pdfSpineWidth,
    threeDSpineWidth,
  };
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

export function scopeCss(css: Css, scope?: string): Css {
  if (!scope) {
    return css;
  }
  return css;
}
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
