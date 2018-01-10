import * as React from 'react';
import { css } from 'glamor';

const styles = {
  backgroundColor: 'green',
};

export default () => (
  <html className={css(styles)}>
    <head>
      <title>Static sites are fast</title>
    </head>
    <body>
      <h2>Hello, good felow.</h2>
    </body>
  </html>
);
