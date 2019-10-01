import { CoverCssModule } from './types';
import { css, scopeCss, docDims } from './helpers';

const front: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const staticCss = css`
    .Cover .front {
      position: relative;
    }

    .Cover .front .logo-icon {
      width: 8%;
      position: absolute;
      top: 5%;
      right: 5%;
    }

    .Cover .front .front__safe {
      position: relative;
      z-index: 2;
      height: 100%;
    }

    .Cover .front .flp {
      color: #aaa;
      position: absolute;
      top: 7%;
      left: 5%;
      font-size: 90%;
      font-size: 95%;
    }

    .Cover .front .front__main {
      width: 100%;
      height: 60%;
    }

    .Cover .front .title-wrap,
    .Cover .front .initials {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      display: flex;
      flex-direction: column;
    }

    .Cover .front .front__main,
    .Cover .front .author {
      position: relative;
      top: 23%;
    }

    .Cover .front .author {
      text-align: center;
      font-size: 200%;
    }

    .Cover .front .author__line {
      width: 40%;
      background: white;
      height: 2px;
      margin: 0 auto 0 auto;
    }

    .Cover .front .title-wrap {
      /* background: rgba(0, 255, 0, 0.3); */
      justify-content: center;
      text-align: center;
      font-size: 300%;
      padding: 0 12%;
    }

    .Cover .front .initials > div {
      width: 100%;
      height: 50%;
      position: relative;
    }

    .Cover .front .initial {
      width: 100%;
      text-align: center;
      position: absolute;
      margin: 0;
      padding: 0;
      color: white;
      opacity: 0.25;
      font-size: 1450%;
      /* font-size: 2.6544506602702698in; */
      /* line-height: 2.6544506602702698in; */
      font-weight: 400;
      left: 0;
    }
  `;

  return [staticCss, ''];
};

export default front;
