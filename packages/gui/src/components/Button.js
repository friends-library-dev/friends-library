// @flow
import styled from '@emotion/styled';

const Button = styled.span`
  opacity: ${({ disabled }) => (disabled ? 0.15 : 1)};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  background: ${({ secondary }) => (secondary ? '#666' : '#61afef')};
  display: inline-block;
  width: 190px;
  height: 50px;
  text-align: center;
  line-height: 50px;
  margin-right: 20px;

  &:hover {
    text-decoration: underline;
  }
`;

export default Button;
