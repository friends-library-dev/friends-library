import * as React from 'react';
import Asciidoc from './Asciidoc';
import Html from './Html';

interface Props {
  id: string;
  emphasize?: number[];
}

const Pair: React.SFC<Props> = ({ id, emphasize }) => (
  <>
    <Asciidoc id={id} emphasize={emphasize} />
    <Html id={id} />
  </>
);

Pair.defaultProps = {
  emphasize: [],
};

export default Pair;
