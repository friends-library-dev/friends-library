import React from 'react';
import { CoverProps } from '@friends-library/types';
import { ThreeD, css as coverCss } from '@friends-library/cover-component';
import Heading from '../Heading';

type Props = CoverProps & {
  authorSlug: string;
  price: number;
  hasAudio: boolean;
  numChapters: number;
  hasAltLanguageVersion: boolean;
  pages: number;
};

const DocBlock: React.FC<Props> = props => {
  return (
    <section>
      <ThreeD {...props} scaler={3 / 5} scope="3-5" />
      <h1>{props.title}</h1>
    </section>
  );
};

export default DocBlock;
