import * as React from 'react';
import styled from '@emotion/styled/macro';

interface Props {
  disabled?: boolean;
  secondary?: boolean;
  height?: number;
  href?: string;
  onClick?: (event: any) => any;
  target?: '_blank' | '_self';
  className?: string;
}

const Component: React.SFC<Props> = props => (
  <StyledSpan
    {...props}
    {...(props.href && !props.disabled ? { as: 'a' } : {})}
    {...(props.disabled ? { onClick: null } : {})}
  >
    {props.children}
  </StyledSpan>
);

export default Component;

const StyledSpan = styled.span`
  opacity: ${({ disabled }: Props) => (disabled ? 0.15 : 1)};
  cursor: ${({ disabled }: Props) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ secondary }: Props) => (secondary ? '#666' : '#61afef')};
  display: inline-block;
  width: 190px;
  height: ${(p: Props) => p.height || 50}px;
  text-align: center;
  line-height: ${(p: Props) => p.height || 50}px;

  &:link,
  &:visited {
    text-decoration: none;
    color: inherit;
  }

  &:hover {
    ${(p: Props) =>
      p.disabled ? '' : p.secondary ? 'background: #777' : 'background: #4d99d8'}
  }
`;
