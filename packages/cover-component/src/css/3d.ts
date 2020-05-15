import { syntax as css } from '@friends-library/types';
import { CoverCssModule } from './types';
import { dynamifyCss, withSizes } from './helpers';

const threeD: CoverCssModule = (scaler, scope) => {
  const staticCss = css`
    .Cover.Cover--3d {
      background: transparent;
      perspective: 2000px;
    }

    .Cover--3d .front,
    .Cover--3d .back,
    .Cover--3d .spine,
    .Cover--3d .top,
    .Cover--3d .bottom,
    .Cover--3d .right {
      position: absolute;
      background: white;
      top: 0;
      left: 0;
    }

    .Cover--3d .top,
    .Cover--3d .bottom,
    .Cover--3d .right {
      background-color: #f5f4ee !important;
    }

    .Cover--3d .top::before,
    .Cover--3d .bottom::before,
    .Cover--3d .right::before {
      display: none;
    }

    .Cover--3d .box {
      margin: 0;
      position: relative;
      transition: transform 0.75s;
      transform-style: preserve-3d;
    }

    .Cover--3d.with-shadow .right,
    .Cover--3d.with-shadow .bottom,
    .Cover--3d.with-shadow .back {
      box-shadow: 0 -7px 25px -5px rgba(0, 0, 0, 0.2),
        0 15px 10px -5px rgba(0, 0, 0, 0.08);
    }
  `;

  const sizeCss = withSizes(
    ({ width, height }) => css`
      .Cover.trim--__SIZE__.Cover--3d,
      .Cover.trim--__SIZE__.Cover--3d .box {
        width: ${width}in;
        height: ${height}in;
      }

      .Cover.trim--__SIZE__.Cover--3d .right {
        height: ${height}in;
      }

      .Cover.trim--__SIZE__.Cover--3d .top,
      .Cover.trim--__SIZE__.Cover--3d .bottom {
        width: ${width}in;
      }

      .Cover.trim--__SIZE__.Cover--3d .right {
        transform: rotateY(90deg) translateZ(${width / 2}in);
      }

      .Cover.trim--__SIZE__.Cover--3d .spine {
        transform: rotateY(-90deg) translateZ(${width / 2}in);
      }

      .Cover.trim--__SIZE__.Cover--3d .top {
        transform: rotateX(90deg) translateZ(${height / 2}in);
      }

      .Cover.trim--__SIZE__.Cover--3d .bottom {
        transform: rotateX(-90deg) translateZ(${height / 2}in);
      }

      .Cover.trim--__SIZE__.Cover--3d.perspective--right .box {
        transform: translateZ(-${width / 2}in) rotateY(-90deg);
      }

      .Cover.trim--__SIZE__.Cover--3d.perspective--angle-front .box {
        transform: translateZ(-${width / 2}in) rotateY(40deg);
      }

      .Cover.trim--__SIZE__.Cover--3d.perspective--angle-back .box {
        transform: translateZ(-${width / 2}in) rotateY(140deg);
      }

      .Cover.trim--__SIZE__.Cover--3d.perspective--spine .box {
        transform: translateZ(-${width / 2}in) rotateY(90deg);
      }
    `,
  );

  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default threeD;
