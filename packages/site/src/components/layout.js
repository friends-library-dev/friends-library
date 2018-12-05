// @flow
import * as React from 'react'
import Helmet from 'react-helmet'
import Slideover from './Slideover';

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
    <div>
      <Slideover />
    </div>
  </>
)
