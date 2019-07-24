import React from 'react';
import { Link } from 'gatsby';
import { styled } from '@friends-library/ui';

const Button = styled(Link)`
  display: block;
  background-color: ${({ theme }) => theme.primary.hex};
  text-align: center;
  text-transform: uppercase;
  margin: 20px 0 5px;
  padding: 7px 0;
  border-radius: 3px;

  && {
    color: #fff;
  }
`;

interface Props {
  url: string;
  text: string;
}

export default ({ text, url }: Props) => <Button to={url}>{text}</Button>;
