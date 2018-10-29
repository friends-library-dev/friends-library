// @flow
import * as React from 'react';
import Asciidoc from '../components/Asciidoc';
import Rendered from '../components/Rendered';
import styled from 'styled-components';

const Code = styled.code`
  color: red;
  background: #eaeaea;
  padding: 0.25em 0.45em;
  border: 1px solid #ccc;
  border-radius: 3px;
`;

const adoc = 'Here is an _emphasized_ word.\n\n';

export default () => (
  <>
    <h1>Emphasis</h1>
    <p>
      Use underscores <Code>_</Code> for basic emphasis.
    </p>
    <Asciidoc adoc={adoc} />
    <Rendered adoc={adoc} />
  </>
);
