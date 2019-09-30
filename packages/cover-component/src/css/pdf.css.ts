import { Css } from '@friends-library/types';
import { css } from './lib/helpers';

const cssStr: Css = css`
  html,
  body {
    margin: 0;
    padding: 0;
  }

  .Cover .print-pdf {
    display: flex;
  }

  @page {
    size: 13in 9in landscape;
    margin: 0;
  }
`;

export default cssStr;
