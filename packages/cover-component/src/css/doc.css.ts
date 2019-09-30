import { Css } from '@friends-library/types';
import { css } from './lib/helpers';

const cssStr: Css = css`
  .Cover .back,
  .Cover .front {
    width: 6in;
    height: 9in;
  }

  .Cover .spine {
    height: 9in;
    width: 1in;
  }
`;

export default cssStr;
