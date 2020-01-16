import { CoverCssModule } from './types';
import { css, dynamifyCss } from './helpers';
import frontMain from './front-main';

const front: CoverCssModule = (scaler, scope) => {
  const [frontMainCss, frontMainDynamicCss] = frontMain();

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

    .Cover.trim--m .front .top-row {
      margin-top: 5%;
    }

    .Cover.trim--xl .front .top-row {
      margin-top: 6.8%;
    }

    .Cover .front .flp {
      color: #aaa;
      flex-grow: 1;
      left: 0;
      font-size: 3.8%;
      margin-top: 1%;
      transform-origin: left center;
      padding-left: 4.2%;
    }

    .Cover.trim--s .front .flp {
      padding-left: 3.1%;
    }

    .Cover.trim--m .front .flp {
      font-size: 3.5%;
    }

    .Cover.trim--xl .front .flp {
      font-size: 3.25%;
    }

    .Cover--scale-xs .front .flp {
      left: 0;
      position: absolute;
      width: 300%;
      font-size: 18%;
      transform: scale(0.26);
      transform-origin: left center;
    }

    .Cover--scale-xs.trim--m .front .flp,
    .Cover--scale-xs.trim--xl .front .flp {
      font-size: 14.5%;
      left: 4%;
    }

    .Cover .front .top-row .logo-icon {
      width: 12.1%;
      margin-right: -1.75%;
    }

    .Cover.trim--m .front .top-row .logo-icon {
      width: 9.5%;
      margin-right: 4%;
    }

    .Cover.trim--xl .front .top-row .logo-icon {
      width: 8.2%;
      margin-right: 4%;
    }

    .Cover .front .author {
      text-align: center;
      font-size: 10%;
      height: 14.5%;
      margin-top: 3.5%;
    }

    .Cover.trim--xl .author {
      height: 16.7%;
    }

    .Cover .author__name {
      transform: scale(0.45) translateY(-20%);
      font-weight: 400;
      opacity: 0.7;
      font-size: 100%;
      white-space: nowrap;
      margin-top: 3%;
    }

    .Cover.trim--m .author__name {
      transform: scale(0.35) translateY(-32%);
    }

    .Cover.trim--xl .author__name {
      transform: scale(0.34) translateY(-44%);
    }

    .Cover .front .author__line {
      width: 40%;
      background: white;
      margin: 0 auto 0 auto;
    }

    .Cover.Cover--front-only.with-shadow {
      box-shadow: 0 -7px 25px -5px rgba(0, 0, 0, 0.2),
        0 15px 10px -5px rgba(0, 0, 0, 0.08);
    }

    ${frontMainCss}
  `;

  const dynamicCss = css`
    .Cover .author__line {
      height: 0.011in;
    }

    ${frontMainDynamicCss}
  `;

  return [staticCss, dynamifyCss(dynamicCss, scope, scaler)];
};

export default front;
