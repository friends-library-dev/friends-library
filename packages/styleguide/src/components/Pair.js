// @flow
import * as React from 'react';
import Asciidoc from './Asciidoc';
import Html from './Html';

export default ({ id }: { id: string }) => (
  <>
    <Asciidoc id={id} />
    <Html id={id} />
  </>
);
