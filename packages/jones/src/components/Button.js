// @flow
import styled from '@emotion/styled';

const Button = styled.span`
  opacity: ${({ disabled }) => (disabled ? 0.15 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ secondary }) => (secondary ? '#666' : '#61afef')};
  display: inline-block;
  width: 190px;
  height: ${p => p.height || '50'}px;
  text-align: center;
  line-height: ${p => p.height || '50'}px;

  &:hover {
    text-decoration: underline;
  }
`;

export default Button;
