// @flow
import * as React from 'react';
import WorkNav from './WorkNav';

export default ({ screen }: { screen: string }) => (
  <>
    {screen !== 'WORK'
      ? <>Friends Library Publishing <i>Online Editor</i></>
      : <WorkNav />
    }
  </>
);
