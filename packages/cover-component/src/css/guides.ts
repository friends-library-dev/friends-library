import { CoverCssModule } from './types';
import { css, dynamifyCss, PRINT_BLEED, withSizes } from './helpers';

const guides: CoverCssModule = (scaler, scope) => {
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

  const sizeCss = withSizes(
    ({ width }) => css`
      .Cover--show-guides.trim--__SIZE__ .guide--spine-left {
        left: ${width}in;
      }

      .Cover--show-guides.trim--__SIZE__ .guide--spine-right {
        right: ${width}in;
      }

      .Cover--show-guides.trim--__SIZE__.Cover--pdf--bleed .guide--spine-left {
        left: ${width + PRINT_BLEED}in;
      }

      .Cover--show-guides.trim--__SIZE__.Cover--pdf--bleed .guide--spine-right {
        right: ${width + PRINT_BLEED}in;
      }
    `,
  );

  const dynamicCss = css`
    ${sizeCss}
    .Cover--show-guides .guide--letter-spacing {
      height: 0.18in;
    }
  `;

  return [staticCss, dynamifyCss(dynamicCss, scope, scaler)];
};

export default guides;
