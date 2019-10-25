import cx from 'classnames';
import { CoverProps, PrintSize, Css } from '@friends-library/types';
import { sizes as bookSizes } from '@friends-library/lulu';

export interface DocDims {
  width: number;
  height: number;
  pdfWidth: number;
  pdfHeight: number;
  pdfSpineWidth: number;
  threeDSpineWidth: number;
  printBleed: number;
}

export function docDims(size: PrintSize, pages: number, scaler?: number): DocDims {
  const { width, height } = bookSizes[size].dims;
  const printBleed = 0.125;
  const spinePad = 0.06;
  const pagesPerInch = 444;
  const threeDSpineWidth = spinePad + pages / pagesPerInch;
  const pdfSpineWidth = pages < 32 ? 0 : threeDSpineWidth;
  const pdfWidth = width * 2 + pdfSpineWidth + printBleed * 2;
  const pdfHeight = height + printBleed * 2;

  return {
    width,
    height,
    pdfWidth,
    pdfHeight,
    pdfSpineWidth,
    threeDSpineWidth,
    printBleed,
  };
}

export function wrapClasses(
  {
    edition,
    lang,
    size,
    scope,
    scaler,
    showGuides,
  }: Pick<CoverProps, 'edition' | 'lang' | 'size' | 'scope' | 'scaler' | 'showGuides'>,
  customClasses?: string | string[] | Record<string, boolean>,
): string {
  const scale = typeof scaler === 'number' ? scaler : 1;
  return cx(
    'Cover',
    `Edition--${edition}`,
    `Lang--${lang}`,
    `trim--${size}`,
    showGuides ? 'Cover--show-guides' : false,
    scope ? `Cover--scope-${scope}` : false,
    scale <= 0.5 ? 'Cover--scale-s' : false,
    scale <= 0.35 ? 'Cover--scale-xs' : false,
    customClasses,
  );
}

export function scaleCssInches(css: Css, scaler?: number): Css {
  if (typeof scaler !== 'number') {
    return css;
  }

  const pattern = /(\d+(?:\.\d+)?)in(?! +{)(;| |\))/g;

  return css.replace(pattern, (full, inches, after) => {
    return `${Number(inches) * scaler}in${after}`;
  });
}

export function scopeCss(css: Css, scope?: string): Css {
  if (!scope) {
    return css;
  }

  return css.replace(/\.Cover(?=\.| |,)/gm, `.Cover--scope-${scope}`);
}

export function dynamifyCss(css: Css, scope?: string, scaler?: number): Css {
  return scopeCss(scaleCssInches(css, scaler), scope);
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
