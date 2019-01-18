// @flow
import * as React from 'react';
import styled from '@emotion/styled/macro';

const StyledSpan = styled.span`
  opacity: ${({ disabled }) => (disabled ? 0.15 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ secondary }) => (secondary ? '#666' : '#61afef')};
  display: inline-block;
  width: 190px;
  height: ${p => p.height || '50'}px;
  text-align: center;
  line-height: ${p => p.height || '50'}px;

  &:link,
  &:visited {
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    ${p => p.disabled ? '' : p.secondary ? 'background: #777' : 'background: #4d99d8'}
  }
`;

export default (props: *) => (
  <StyledSpan
    {...props}
    {...props.href && !props.disabled ? { as: 'a' } : {}}
    {...props.disabled ? { onClick: null } : {}}
  >
    {props.children}
  </StyledSpan>
);
