// @flow
import * as React from 'react';
import styled from 'styled-components';
import {
  Pair,
  H1,
  H2,
  Para,
  Code,
  Section,
  Note,
  Snippet,
  Asciidoc,
} from '../components';

export default () => (
  <Section id="breaks">
    <H1>Breaks &amp; Offsets</H1>

    <H2>Asterisms:</H2>
    <Para>
      An <b>asterism</b> represents a <i>significant thematic
      break</i> in the flow of the text. It is marked in asciidoc
      by a line with <Code>[.asterism]</Code> followed by a line
      with three straight apostrophes <Code>'''</Code>.
      It is rendered with 3 centered asterisks.
    </Para>
    <Snippet trigger="ast" expansion={`[.asterism]\n'''`} />
    <Pair id="asterism" emphasize={[5,6]} />

    <H2>Small Breaks:</H2>
    <Para>
      A <i>minor thematic break</i> (less significant than an asterism)
      can be created similarly to an asterism, except substituting
      the class <Code>[.small-break]</Code>.
      It is rendered as a small break between paragraphs.
    </Para>
    <Snippet trigger="sb" expansion={`[.small-break]\n'''`} />
    <Pair id="small-break" emphasize={[16,17]} />

    <H2>Offset Paragraphs:</H2>
    <Para>
      An <i>offset paragraph</i> indicates a paragraph which differs
      thematically from the paragraphs below <i>and</i> above.
      Offset paragraphs are often useful for chunks which weave together
      different parts of a narrative. For instance, if an editor
      has interposed a connecting explanation between portions of a journal
      or diary, as shown below:
    </Para>
    <Snippet trigger="off" expansion="[.offset]" />
    <Pair id="offset" emphasize={[16]} />
  </Section>
)
