import * as React from 'react';
import WorkNav from './WorkNav';

interface Props {
  screen: string;
}

const Component: React.SFC<Props> = ({ screen }) => (
  <>
    {screen !== 'WORK' ? (
      <>
        Friends Library Publishing <i>Online Editor</i>
      </>
    ) : (
      <WorkNav />
    )}
  </>
);

export default Component;
