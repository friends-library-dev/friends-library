// @flow
import styled from 'styled-components';

export const H1 = styled.h1`
  color: #d62529;
  font-family: "Helvetica Neue", Helvetica, arial, sans-serif;
  font-weight: 200;
  letter-spacing: 2px;
  font-size: 2.75em;
  margin-top: 0.45em;
  margin-bottom: -10px;

  &::before {
    content: "¶ "
  }

  & + h1 {
    margin-top: 50px;
  }
`


export const H2 = styled.h1`
  color: #d62529;
  font-family: "Helvetica Neue", Helvetica, arial, sans-serif;
  font-weight: 200;
  letter-spacing: 1.75px;
  font-size: 1.85em;
  margin-top: 85px;
  margin-bottom: -30px;
`
