import { CoverCssModule } from './types';
import { css, docDims, dynamifyCss } from './helpers';

const guides: CoverCssModule = ({ size, pages }) => {
  const staticCss = css`
    .Cover--show-guides .guide--spine {
      border-color: blue;
    }

    .Cover--show-guides .guide {
      box-sizing: border-box;
      border-style: dashed;
      display: block;
      position: absolute;
      border-width: 0;
    }

    .Cover--show-guides .guide--vertical {
      height: 100%;
      border-right-width: 1px;
      top: 0;
      z-index: 1;
    }

    .Cover--show-guides {
      position: relative;
    }

    .Cover--show-guides .guide--spine-center {
      border-color: magenta;
      opacity: 0.75;
    }

    .Cover--show-guides .guide--letter-spacing {
      width: 70%;
      margin: 0 15%;
      border-top: 1px dashed green !important;
      border-bottom: 1px dashed green !important;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }

    .Cover--show-guides .guide--front-vertical-center {
      left: 50%;
      border-color: green !important;
    }

    .Cover--show-guides .front__safe,
    .Cover--show-guides .back__safe {
      outline: 1px dashed orange;
      outline-offset: -1px;
      position: relative;
      z-index: 1;
    }

    .Cover--show-guides.Cover--pdf--bleed .print-pdf {
      outline: 1px dashed red;
      outline-offset: -1px;
      position: relative;
      z-index: 1;
    }

    .Cover--show-guides .binding--saddle-stitch .guide--spine {
      width: 0;
      display: none;
    }
  `;

  const dims = docDims(size, pages);
  const dynamicCss = css`
    .Cover--show-guides .guide--spine-left {
      left: ${dims.width}in;
    }

    .Cover--show-guides .guide--spine-right {
      right: ${dims.width}in;
    }

    .Cover--show-guides.Cover--pdf--bleed .guide--spine-left {
      left: ${dims.width + dims.printBleed}in;
    }

    .Cover--show-guides.Cover--pdf--bleed .guide--spine-right {
      right: ${dims.width + dims.printBleed}in;
    }

    .Cover--show-guides .guide--spine-center {
      left: ${dims.pdfSpineWidth / 2}in;
    }

    .Cover--show-guides .guide--letter-spacing {
      height: 0.18in;
    }
  `;

  return [staticCss, dynamifyCss(dynamicCss)];
};

export default guides;
