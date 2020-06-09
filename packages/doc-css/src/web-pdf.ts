import { DocPrecursor, Css } from '@friends-library/types';
import { joinCssFiles, replaceVars, runningHead } from './helpers';

export default function paperbackInterior(dpc: DocPrecursor): Css {
  let css = joinCssFiles([
    `common`,
    `not-mobi7`,
    `pdf/base`,
    `pdf/typography`,
    `pdf/half-title`,
    `pdf/original-title`,
    `pdf/copyright`,
    `pdf/toc`,
    `pdf/chapter-heading`,
    `pdf/web-pdf`,
    ...(dpc.notes.size < 5 ? [`pdf/symbol-notes`] : []),
  ]);

  const { customCode } = dpc;
  css += customCode.css.all || ``;
  css += customCode.css.pdf || ``;
  css += customCode.css[`web-pdf`] || ``; // @TODO rename all repo files!!!

  return replaceVars(css, { '--running-head-title': `"${runningHead(dpc)}"` });
}
