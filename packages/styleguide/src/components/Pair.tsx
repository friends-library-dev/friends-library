import * as React from 'react';
import Asciidoc from './Asciidoc';
import Html from './Html';

type Props = {
  id: string;
  emphasize?: number[];
};

const Pair = ({ id, emphasize }: Props) => (
  <>
    <Asciidoc id={id} emphasize={emphasize} />
    <Html id={id} />
  </>
);

Pair.defaultProps = {
  emphasize: [],
};

export default Pair;
