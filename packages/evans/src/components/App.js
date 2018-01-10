// @flow
import * as React from 'react';
import { css } from 'glamor';

type Props = {|
  title: string,
  children: React.Node,
|};

const styles = {
  backgroundColor: 'green',
};

export default ({ title, children }: Props) => (
  <html className={css(styles)}>
    <head>
      <title>{title}</title>
    </head>
    <body>
      {children}
    </body>
  </html>
);
