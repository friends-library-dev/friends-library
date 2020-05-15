import { syntax as css } from '@friends-library/types';
import { CoverCssModule } from './types';
import { dynamifyCss, withSizes } from './helpers';

const common: CoverCssModule = (scaler, scope) => {
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

    .Cover h1,
    .Cover h2,
    .Cover h3,
    .Cover h4,
    .Cover h5,
    .Cover h6,
    .Cover p,
    .Cover hr,
    .Cover figure,
    .Cover pre {
      margin: 0; /* match tailwind reset */
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

    .Cover.trim--m::after,
    .Cover--3d.trim--m .box > *::after {
      height: 16.8%;
    }

    .Cover.trim--xl::after,
    .Cover--3d.trim--xl .box > *::after {
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

    .Edition--updated.Lang--es .logo-icon {
      fill: #c18c59;
    }

    .Cover.Edition--original:not(.Cover--3d),
    .Cover--3d.Edition--original .box > * {
      background-color: #9d9d80;
    }

    .Cover.Edition--updated.Lang--es:not(.Cover--3d),
    .Cover--3d.Edition--updated.Lang--es .box > * {
      background-color: #c18c59;
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

  const sizeCss = css`
    .Cover .back > div,
    .Cover .front > div {
      margin: 0.25in; /* safety margin for printing */
    }
  `;

  const trimSizeCss = withSizes(
    ({ width, height }) => css`
      .Cover.Cover--front-only.trim--__SIZE__ {
        height: ${height}in;
        width: ${width}in;
      }

      .Cover.trim--__SIZE__ {
        font-size: ${width}in;
      }

      .Cover.trim--__SIZE__ .back,
      .Cover.trim--__SIZE__ .front,
      .Cover.trim--__SIZE__ .spine {
        height: ${height}in;
      }

      .Cover.trim--__SIZE__ .back,
      .Cover.trim--__SIZE__ .front {
        width: ${width}in;
      }
    `,
  );

  return [staticCss, dynamifyCss(`${sizeCss}${trimSizeCss}`, scope, scaler)];
};

export default common;
