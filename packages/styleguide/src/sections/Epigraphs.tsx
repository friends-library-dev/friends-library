import * as React from 'react';
import { Pair, H1, H2, Para, Code, Section, Note } from '../components';

export default () => (
  <Section id="epigraphs">
    <H1>Epigraphs</H1>
    <Para>
      An <b>epigraph</b> is a phrase or quotation that is set at the beginning of a
      document. In our books, these are almost always scripture quotations. Epigraphs are
      just quote blocks with the class <Code>.epigraph</Code> applied, but are rendered
      differently from normal block or scripture quotes.
    </Para>
    <Pair id="epigraph" />

    <H2>Multiple Epigraphs:</H2>
    <Para>
      Some books have <b>multiple epigraphs.</b> That's fine, just list them one after
      another. They will be joined by an <i>asterism</i> in the rendered document.
    </Para>
    <Pair id="epigraphs" />
    <Note>
      Epigraphs must be placed at the <i>beginning</i> of the <b>first source document</b>{' '}
      in order to be properly identified, extracted, and rendered in their proper place
      with the rest of the frontmatter.
    </Note>
  </Section>
);
