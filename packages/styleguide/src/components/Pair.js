// @flow
import * as React from 'react';
import Asciidoc from './Asciidoc';
import Html from './Html';

type Props = {
  id: string,
  emphasize?: Array<number>,
};

export default ({ id, emphasize }: Props) => (
  <>
    <Asciidoc id={id} emphasize={emphasize} />
    <Html id={id} />
  </>
);
