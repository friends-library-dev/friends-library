import { Css } from '@friends-library/types';
import { css } from './lib/helpers';

const cssStr: Css = css`
  html,
  body {
    margin: 0;
    padding: 0;
  }
  @page {
    size: 6in 9in portrait;
    margin: 0;
  }
`;

export default cssStr;
