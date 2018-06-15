// @flow
import * as React from 'react';
import { css } from 'glamor';
import Block from './Block';

type Props = {|
  title: string,
  blurb?: string,
  fontColor?: string,
  bgColor?: string,
|};

const TempBlock = ({
  title, blurb, fontColor, bgColor,
}: Props) => {
  const element = css`
    color: ${fontColor};
    background-color: ${bgColor};

    > p {
      margin: 0 0 10px;
    }
  `;

  return (
    <Block className={element}>
      <h1>{title}</h1>
      {blurb && <p>{blurb}</p>}
    </Block>
  );
};

TempBlock.defaultProps = {
  blurb: '',
  fontColor: '#666',
  bgColor: '#fff',
};

export default TempBlock;
