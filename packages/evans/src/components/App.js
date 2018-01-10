import * as React from 'react';
import { css } from 'glamor';

const styles = {
  backgroundColor: 'green',
};

export default ({ title, children }) => (
  <html className={css(styles)}>
    <head>
      <title>{title}</title>
    </head>
    <body>
      {children}
    </body>
  </html>
);
