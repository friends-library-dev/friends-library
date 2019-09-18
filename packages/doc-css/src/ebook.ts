import { Css, DocPrecursor } from '@friends-library/types';
import { joinCssFiles, toCss } from './helpers';

export function epub(dpc: DocPrecursor): Css {
  let css = joinCssFiles(['common', 'ebook/common', 'not-mobi7', 'ebook/epub']);

  const { customCode } = dpc;
  css += customCode.css.all || '';
  css += customCode.css.ebook || '';
  css += customCode.css.epub || '';

  return css;
}

export function mobi(dpc: DocPrecursor): Css {
  let css = joinCssFiles(['common', 'ebook/common']);
  css += `\n@media amzn-mobi {\n${toCss('ebook/mobi')}\n}`;
  css += `\n@media amzn-kf8 {\n${toCss('not-mobi7')}\n${toCss('ebook/kf8')}\n}`;

  const { customCode } = dpc;
  css += customCode.css.all || '';
  css += customCode.css.ebook || '';
  css += customCode.css.mobi || '';

  return css;
}
