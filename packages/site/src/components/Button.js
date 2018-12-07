// @flow
import * as React from 'react';
import styled from '@emotion/styled';

const Button = styled.a`
  display: block;
  background-color: ${({ theme }) => theme.primary};
  text-align: center;
  text-transform: uppercase;
  margin: 20px 0 5px;
  padding: 7px 0;
  border-radius: 3px;

  && {
    color: #fff;
  }
`;

type Props = {|
  url: string,
  text: string,
|};

export default ({ text, url }: Props) => (
  <Button href={url}>{text}</Button>
);
