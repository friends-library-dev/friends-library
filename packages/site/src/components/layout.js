// @flow
import React, { useState, Fragment } from 'react'
import type { Node } from 'react';
import Helmet from 'react-helmet'
import Slideover from './Slideover';
import StickyNav from './StickyNav';
import './Layout.css';

type Props = {|
  children: Node,
|};

export default ({ children }: Props) => {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <Fragment>
      <Helmet>
        <html lang="en" />
        <title>Friends Library</title>
        <meta name="robots" content="noindex, nofollow" />
        <link href="https://netdna.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.css" rel="stylesheet prefetch" />
      </Helmet>
      <Slideover isOpen={navOpen} close={() => setNavOpen(false)} />
      <StickyNav onHamburgerClick={() => setNavOpen(!navOpen)} />
    </Fragment>
  )
}
