// @flow
import * as React from 'react';
import { css } from 'glamor';
import { PRIMARY } from './Theme';

const button = css`
  display: block;
  background-color: ${PRIMARY};
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
  <a href={url} className={button}>{text}</a>
);
