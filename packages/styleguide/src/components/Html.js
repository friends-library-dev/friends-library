// @flow
import * as React from 'react';
import styled from 'styled-components';

import frags from '../../dist/frags.json';

const StyledDiv = styled.div`
  background: white;
  font-family: Georgia;
  padding: 3em 5em;
  box-shadow: 3px 3px 3px #aaa;
  margin-bottom: 70px;
`;

export default ({ id }: { id: string }) => (
  <StyledDiv className="rendered-adoc html">
    <div className="body" dangerouslySetInnerHTML={{ __html: frags[id].html }} />
  </StyledDiv>
);
