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

  const dims: Record<string, number> = {
    width,
    height,
    pdfSpineWidth,
    threeDSpineWidth,
  };
  return dims;
  // return Object.keys(dims).reduce(
  //   (scaled, key) => {
  //     scaled[key] = dims[key] * (scaler || 1);
  //     return scaled;
  //   },
  //   {} as Record<string, number>,
  // );
}

export function wrapClasses(
  { edition, lang, size, scope }: Pick<CoverProps, 'edition' | 'lang' | 'size' | 'scope'>,
  customClasses?: string | string[] | Record<string, boolean>,
): string {
  return cx(
    'Cover',
    `Edition--${edition}`,
    `Lang--${lang}`,
    `trim--${size}`,
    scope ? `Cover--scope-${scope}` : false,
    customClasses,
  );
}

export function scaleCssInches(css: Css, scaler?: number): Css {
  if (typeof scaler !== 'number') {
    return css;
  }

  const pattern = /(\d*(?:\.\d+)?)in(?! +{)(;| |\))/g;

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
  console.log({ scaler });
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
