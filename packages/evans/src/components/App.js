// @flow
import * as React from 'react';
import { css } from 'glamor';
import StickyNav from './StickyNav';
import Slideover from './Slideover';
import Footer from './Footer';
import { PRIMARY } from './Theme';

type Props = {|
  title: string,
  children: React.Node,
|};

const app = css`
  & a {
    color: ${PRIMARY};
  }
  & a:hover {
    border-bottom-color: ${PRIMARY};
  }
`;

const content = css`
  padding-top: 52px;
  position: relative;
  background: #fff;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default ({ title, children }: Props) => (
  <html lang="en" className={app}>
    <head>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="noindex, nofollow" />
      <link href="https:////netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css" rel="stylesheet prefetch" />
    </head>
    <body>
      <Slideover />
      <StickyNav />
      <div id="App__Content" className={content}>
        {children}
        <Footer />
      </div>
      <script async src="/js/bundle.js" />
    </body>
  </html>
);
