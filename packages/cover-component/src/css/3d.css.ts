import { Css } from '@friends-library/types';
import { css } from './lib/helpers';

export default function threeDCss(dims: Record<string, number>): Css {
  return css`
    .Cover--3d,
    .Cover--3d .box {
      width: ${dims.width};
      height: ${dims.height};
    }

    .Cover--3d .box {
      position: relative;
      transition: transform 0.75s;
      transform-style: preserve-3d;
      transform: translateZ(${dims.threeDSpineWidth / 2}in);
    }
  `;
}
