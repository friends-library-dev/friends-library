import { CoverCssModule } from './types';
import { css, dynamifyCss } from './helpers';
import frontMain from './front-main';

const front: CoverCssModule = (props, scaler, scope) => {
  const [frontMainCss, frontMainDynamicCss] = frontMain(props, scaler, scope);

  const staticCss = css`
    .Cover .front__safe {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .Cover .front .top-row {
      margin-bottom: auto;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      z-index: 1;
    }

    .Cover .front .flp {
      color: #aaa;
      flex-grow: 1;
      left: 0;
      font-size: 3.9%;
      transform-origin: left center;
    }

    .Cover--scale-xs .front .flp {
      left: 0;
      position: absolute;
      width: 300%;
      font-size: 18%;
      transform: scale(0.26);
      transform-origin: left center;
    }

    .Cover .front .top-row .logo-icon {
      width: 11%;
    }

    .Cover .front .author {
      z-index: 1; /* why? */
      text-align: center;
      font-size: 10%;
      height: 15%;
      margin-top: 2%;
    }

    .Cover .author__name {
      transform: scale(0.5) translateY(-10%);
      font-weight: 400;
      opacity: 0.7;
      font-size: 100%;
    }

    .Cover.trim--m .author__name {
      transform: scale(0.39) translateY(-29%);
    }

    .Cover .front .author__line {
      width: 40%;
      background: white;
      margin: 0 auto 0 auto;
    }

    ${frontMainCss}
  `;

  const dynamicCss = css`
    .Cover .author__line {
      height: 0.018in;
    }
    ${frontMainDynamicCss}
  `;

  return [staticCss, dynamifyCss(dynamicCss, scope, scaler)];
};

export default front;
