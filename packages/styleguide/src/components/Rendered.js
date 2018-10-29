// @flow
import * as React from 'react';
import styled from 'styled-components';

import frags from '../../dist/frags.json';

const StyledDiv = styled.div`
  background: green;
  font-family: Georgia;
  padding: 1em;
`;

export default ({ id }: { id: string }) => (
  <StyledDiv
    className="rendered-adoc"
    dangerouslySetInnerHTML={{ __html: frags[id].html }}
  />
);
