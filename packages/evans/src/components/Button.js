// @flow
import * as React from 'react';
import { Link } from 'gatsby';
import styled from '@emotion/styled';

const Button = styled(Link)`
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
  <Button to={url}>{text}</Button>
);
