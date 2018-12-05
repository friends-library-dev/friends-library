// @flow
import * as React from 'react'
import Helmet from 'react-helmet'
import Slideover from './Slideover';
import StickyNav from './StickyNav';
import './Layout.css';

type Props = {|
  children: React.Node,
|};

export default ({ children }: Props) => (
  <React.Fragment>
    <Helmet>
      <html lang="en" />
      <title>Friends Library</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <div>
      <Slideover />
      <StickyNav />
    </div>
  </React.Fragment>
)
