import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const common: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    .Cover {
      font-family: 'Baskerville', Georgia, serif;
      color: white;
      position: relative;
      display: inline-block;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      box-sizing: border-box;
    }

    .Cover *,
    .Cover *:before,
    .Cover *:after {
      box-sizing: inherit;
    }

    .Cover .front,
    .Cover .back {
      display: flex;
      align-items: stretch;
    }

    .Cover .back > div,
    .Cover .front > div {
      flex-grow: 1;
    }

    .Cover:not(.Cover--3d)::after,
    .Cover--3d .box > *::after {
      content: '';
      display: block;
      position: absolute;
      z-index: 0;
      top: 0;
      height: 13%;
      width: 100%;
      background-color: white;
    }

    /* start TEMP */
    /* .Cover .front {
      position: relative;
    }
    .Cover .front::after {
      content: '';
      display: block;
      position: absolute;
      z-index: 1;
      top: 0;
      height: 13%;
      width: 100%;
      background-color: rgba(0, 255, 0, 0.5);
    }
    .Cover.trim--m .front::after {
      height: 16.8%;
    }
    .Cover.trim--xl .front::after {
      height: 18.8%;
    } */
    /* end TEMP */

    .Cover.trim--m::after {
      height: 16.8%;
    }

    .Cover.trim--xl::after {
      height: 18.8%;
    }

    .Edition--original .logo-icon {
      fill: #9d9d80;
    }

    .Edition--modernized .logo-icon {
      fill: #628c9d;
    }

    .Edition--updated .logo-icon {
      fill: #6c3142;
    }

    .Cover.Edition--original:not(.Cover--3d),
    .Cover--3d.Edition--original .box > * {
      background-color: #9d9d80;
    }

    .Cover.Edition--modernized:not(.Cover--3d),
    .Cover--3d.Edition--modernized .box > * {
      background-color: #628c9d;
    }

    .Cover.Edition--updated:not(.Cover--3d),
    .Cover--3d.Edition--updated .box > * {
      background-color: #6c3142;
    }
  `;

  const dims = docDims(size, pages, scaler);
  const sizeCss = css`
    .Cover {
      font-size: ${dims.width}in;
    }

    .Cover .back,
    .Cover .front,
    .Cover .spine {
      height: ${dims.height}in;
    }

    .Cover .back,
    .Cover .front {
      width: ${dims.width}in;
    }

    .Cover .spine {
      width: ${dims.pdfSpineWidth}in;
    }

    .Cover .back > div,
    .Cover .front > div {
      margin: 0.25in; /* safety margin for printing */
    }
  `;

  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default common;
