import * as React from 'react';
import { Pair, Asciidoc, H1, Note, Para, Section, Snippet } from '../components';

const ChapterSynopsis: React.FC = () => (
  <Section id="chapter-synopsis">
    <H1>Chapter Synopsis</H1>
    <Para>
      Some of our books contain <i>chapter synopsis</i> chunks right after the chapter
      title. These are marked up in asciidoc as shown below:
    </Para>
    <Snippet trigger="cs" expansion="[.chapter-synopsis]" />
    <Pair id="chapter-synopsis" />

    <Note>
      Any <b>footnote</b> on a chapter synopsis <i>item</i> needs to be contained on the
      same line, as shown here:
    </Note>
    <Asciidoc id="chapter-synopsis-footnote" emphasize={[4]} />
  </Section>
);

export default ChapterSynopsis;
