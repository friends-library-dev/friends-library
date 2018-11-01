// @flow
import styled from 'styled-components';

export default styled.p`
  color: #555;
  font-size: 21px;
  font-family: sans-serif;
  font-weight: 200;
  margin: 2.5em 0 1.5em 0;
  & + &,
  ul + & {
    margin-top: 1.75em;
  }
`;
