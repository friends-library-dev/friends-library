import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const front: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    .Cover .front__safe {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    .Cover .front .top {
      background: red;
      margin-bottom: auto;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: flex-end;
    }

    .Cover .front .flp {
      color: #aaa;
      flex-grow: 1;
      left: 0;
      position: absolute;
      width: 200%;
      font-size: 15%;
      transform: scale(0.26);
      transform-origin: left center;
    }

    .Cover .front .top .logo-icon {
      width: 11%;
    }

    .Cover .front .front__main {
      /* background: rgba(0, 255, 0, 0.1); */
      position: relative;
    }

    .Cover .front .title-wrap,
    .Cover .front .initials {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      display: flex;
      flex-direction: column;
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

    .Cover .front .title-wrap {
      justify-content: center;
      text-align: center;
    }

    .Cover .front .title-wrap .title {
      margin-right: -6%;
      margin-left: -6%;
      width: 150%;
      line-height: 200%;
      font-size: 18%;
      transform: translateX(-12.5%) scale(0.46);
      transform-origin: center center;
      letter-spacing: 0.0335em;
    }

    .Cover .front .initials > div {
      flex-grow: 1;
      position: relative;
    }

    .Cover .initials__top {
      /* background: green; */
    }

    .Cover .initials__bottom {
      /* background: purple; */
    }

    .Cover .front .initial {
      text-align: center;
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      margin: 0;
      padding: 0;
      color: white;
      opacity: 0.25;
      font-size: 50%;
      /* font-size: 2.6544506602702698in; */
      /* line-height: 2.6544506602702698in; */
      line-height: 1em;
      font-weight: 400;
      left: 0;
    }
  `;

  const dynamicCss = css`
    .Cover .author__line {
      height: 0.018in;
    }

    .Cover.trim--s .front__main {
      height: 4in;
    }

    .Cover.trim--m .front__main {
      height: 4.825in;
    }

    .Cover.trim--xl .front__main {
      height: 4.7in;
    }
  `;

  return [staticCss, dynamifyCss(dynamicCss, scope, scaler)];
};

export default front;
