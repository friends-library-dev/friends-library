import { css } from '../css';

const diamondCss: string = css`
  .diamond,
  .diamond__shape {
    position: absolute;
    width: 0.26in;
    height: 0.26in;
    left: 50%;
  }

  .diamond {
    top: 2in;
    transform: translateX(-50%);
  }

  .diamond__shape {
    background: white;
    transform: translateX(-50%) rotate(45deg);
  }

  .diamond__initial {
    font-family: Georgia;
    font-size: 0.21in;
    position: absolute;
    color: var(--bgColor);
    width: 0.26in;
    text-align: center;
    top: 50%;
    transform: translateY(-50%);
  }
`;

export default diamondCss;
