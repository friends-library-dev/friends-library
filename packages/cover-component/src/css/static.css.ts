import { Css } from '@friends-library/types';
import { css } from './lib/helpers';

const cssStr: Css = css`
  .CoverFront,
  .CoverBack,
  .CoverSpine {
    font-family: 'Baskerville', Georgia, serif;
    background: white;
    color: white;
  }

  .CoverFront {
    position: relative;
    background: linear-gradient(0deg, red, red 80%, white 80%);
  }

  .CoverFront .front__safe {
    position: relative;
    z-index: 2;
  }

  .bg-color--original {
    background-color: #9d9d80;
  }

  .bg-color--modernized {
    background-color: #628c9d;
  }

  .bg-color--updated {
    background-color: #6c3142;
  }
`;

export default cssStr;
