import { CoverCssModule } from './types';
import { css, dynamifyCss, docDims } from './helpers';

const threeD: CoverCssModule = ({ size, pages }, scaler, scope) => {
  const dims = docDims(size, pages, scaler);
  const leftOffset = (dims.width - dims.threeDSpineWidth) / 2;
  const topOffset = (dims.height - dims.threeDSpineWidth) / 2;

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
      background: #f5f4ee;
    }

    .Cover--3d .box {
      margin: 0;
      position: relative;
      transition: transform 0.75s;
      transform-style: preserve-3d;
    }
  `;

  const sizeCss = css`
    .Cover--3d,
    .Cover--3d .box {
      width: ${dims.width}in;
      height: ${dims.height}in;
    }

    .Cover--3d .box .spine,
    .Cover--3d .right {
      width: ${dims.threeDSpineWidth}in;
      left: ${leftOffset}in;
    }

    .Cover--3d .right {
      height: ${dims.height}in;
    }

    .Cover--3d .top,
    .Cover--3d .bottom {
      height: ${dims.threeDSpineWidth}in;
      width: ${dims.width}in;
      top: ${topOffset}in;
    }

    .Cover--3d .box {
      transform: translateZ(${dims.threeDSpineWidth / 2}in);
    }

    /* 3d-positioning of cover PARTS */
    .Cover--3d .front {
      transform: rotateY(0deg) translateZ(${dims.threeDSpineWidth / 2}in);
    }

    .Cover--3d .back {
      transform: rotateY(180deg) translateZ(${dims.threeDSpineWidth / 2}in);
    }

    .Cover--3d .right {
      transform: rotateY(90deg) translateZ(${dims.width / 2}in);
    }

    .Cover--3d .spine {
      transform: rotateY(-90deg) translateZ(${dims.width / 2}in);
    }

    .Cover--3d .top {
      transform: rotateX(90deg) translateZ(${dims.height / 2}in);
    }

    .Cover--3d .bottom {
      transform: rotateX(-90deg) translateZ(${dims.height / 2}in);
    }

    /* 3d positioning of ENTIRE cover */
    .Cover--3d.perspective--front .box {
      transform: translateZ(-${dims.threeDSpineWidth}in) rotateY(0deg);
    }

    .Cover--3d.perspective--back .box {
      transform: translateZ(-${dims.threeDSpineWidth}in) rotateY(180deg);
    }

    .Cover--3d.perspective--right .box {
      transform: translateZ(-${dims.width / 2}in) rotateY(-90deg);
    }

    .Cover--3d.perspective--angle-front .box {
      transform: translateZ(-${dims.width / 2}in) rotateY(40deg);
    }

    .Cover--3d.perspective--angle-back .box {
      transform: translateZ(-${dims.width / 2}in) rotateY(140deg);
    }

    .Cover--3d.perspective--spine .box {
      transform: translateZ(-${dims.width / 2}in) rotateY(90deg);
    }
  `;

  return [staticCss, dynamifyCss(sizeCss, scope, scaler)];
};

export default threeD;
