// @flow
import * as React from 'react';
import { css } from 'glamor';
import StickyNav from './StickyNav';
import Slideover from './Slideover';

type Props = {|
  title: string,
  children: React.Node,
|};

const content = css`
  padding-top: 52px;
  position: relative;
  background: #fff;
  min-height: 100vh;
`;

export default ({ title, children }: Props) => (
  <html>
    <head>
      <title>{title}</title>
    </head>
    <body>
      <Slideover />
      <StickyNav />
      <div className={content}>
        {children}
      </div>
    </body>
  </html>
);
