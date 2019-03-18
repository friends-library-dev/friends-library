import * as React from 'react';
import styled from '@emotion/styled/macro';

const Wrap = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

const Component: React.SFC = ({ children }) => <Wrap>{children}</Wrap>;
export default Component;
