// @flow
import * as React from 'react'
import Helmet from 'react-helmet'

import Header from './header'
import './layout.css'

type Props = {|
  children: React.Node,
|};

export default ({ children }: Props) => (
  <>
    <Helmet>
      <html lang="en" />
      <title>Friends Library</title>
      <meta name="robots" content="noindex, nofollow" />
    </Helmet>
    <Header siteTitle="Friends Library is the best! 👍" />
    <div
      style={{
        margin: '0 auto',
        maxWidth: 960,
        padding: '0px 1.0875rem 1.45rem',
        paddingTop: 0,
      }}
    >
      {children}
    </div>
  </>
)
