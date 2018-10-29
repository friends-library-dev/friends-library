// @flow
import * as React from 'react';
import styled from 'styled-components';
import frags from '../../dist/frags'

const StyledPre = styled.pre`
  background: #f9f9d1;
  padding: 1em;
  position: relative;

  &::before {
    content: 'ASCIIDOC';
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 11px;
    ${'' /* color: #999; */} opacity: 0.25;
  }
`;

export default ({ id }: { id: string }) => <StyledPre>{frags[id].adoc}</StyledPre>;
