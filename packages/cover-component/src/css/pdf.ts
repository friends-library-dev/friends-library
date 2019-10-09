import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const pdf: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    html.prince,
    html.prince body {
      margin: 0;
      padding: 0;
    }

    .Cover .print-pdf {
      display: flex;
    }

    @page {
      margin: 0;
    }
  `;

  const BLEED = 0.125;
  const dims = docDims(size, pages, scaler);
  const width = dims.width * 2 + dims.pdfSpineWidth + 2 * BLEED;
  const height = dims.height + 2 * BLEED;

  const sizeCss = css`
    .Cover.browser {
      width: ${width}in;
      height: ${height}in;
    }

    .Cover .print-pdf {
      margin: 0.125in;
    }

    /* change percentage height of white block because now padded by bleed area */
    .Cover.trim--s::after {
      height: 14.376%;
    }

    .Cover.trim--m::after {
      height: 17.817%;
    }

    .Cover.trim--xl::after {
      height: 19.707%;
    }

    .Cover .guide--spine {
      border-color: blue;
    }

    .Cover .guide {
      box-sizing: border-box;
      border-style: dashed;
      display: block;
      position: absolute;
      border-width: 0;
    }

    .Cover .guide--vertical {
      height: 100%;
      border-right-width: 1px;
      top: 0;
      z-index: 1;
    }

    .Cover--show-guides {
      position: relative;
    }

    .Cover .guide--spine-left {
      left: ${dims.width + BLEED}in;
    }

    .Cover .guide--spine-right {
      right: ${dims.width + BLEED}in;
    }

    .Cover .guide--spine-center {
      border-color: magenta;
      opacity: 0.75;
      left: ${dims.pdfSpineWidth / 2}in;
    }

    @page {
      size: ${width}in ${height}in landscape;
    }
  `;
  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default pdf;
