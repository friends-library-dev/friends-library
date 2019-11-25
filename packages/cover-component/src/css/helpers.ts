import cx from 'classnames';
import { CoverProps, PrintSize, Css } from '@friends-library/types';
import { sizes as bookSizes, PAGES_PER_INCH } from '@friends-library/lulu';

export interface DocDims {
  width: number;
  height: number;
}

export function threeDSpineWidth(pages: number): number {
  return SPINE_PAD + pages / PAGES_PER_INCH;
}

export function pdfSpineWidth(pages: number): number {
  return pages < 32 ? 0 : threeDSpineWidth(pages);
}

export function pdfHeight(size: PrintSize): number {
  const { height } = docDims(size);
  return height + PRINT_BLEED * 2;
}

export function pdfWidth(size: PrintSize, pages: number): number {
  const { width } = docDims(size);
  return width * 2 + pdfSpineWidth(pages) + PRINT_BLEED * 2;
}

export function docDims(size: PrintSize): DocDims {
  const { width, height } = bookSizes[size].dims;
  return {
    width,
    height,
  };
}

export function allSizesDocDims(): { [k in PrintSize]: DocDims } {
  return {
    s: docDims('s'),
    m: docDims('m'),
    xl: docDims('xl'),
  };
}

export function withSizes(fn: (dims: DocDims, size: PrintSize) => Css): Css {
  const sizes: PrintSize[] = ['s', 'm', 'xl'];
  return sizes.map(size => fn(docDims(size), size).replace(/__SIZE__/g, size)).join('\n');
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

export function spineAuthorDisplay(
  title: string,
  author: string,
  size: PrintSize,
  isCompilation: boolean,
): 'block' | 'none' {
  if (isCompilation) {
    return 'none';
  }

  const lastName = String(author.split(' ').pop());
  let totalChars = title.replace(/&nbsp;/g, ' ').length + lastName.length;
  const numWideLetters = (`${title}${lastName}`.match(/(W|D)/g) || []).length;
  totalChars += numWideLetters;

  if (size === 'm' && totalChars >= 50) {
    return 'none';
  }

  return 'block';
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

const SPINE_PAD = 0.06;
export const PRINT_BLEED = 0.125;
