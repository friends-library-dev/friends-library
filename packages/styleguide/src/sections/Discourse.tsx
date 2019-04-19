import * as React from 'react';
import { Pair, H1, H2, Para, Code, Section, Note, Snippet } from '../components';

export default () => (
  <Section id="discourse">
    <H1>Discourse</H1>
    <Para>
      Chunks of books where there is a form of <i>discourse</i> can be marked up with the{' '}
      <Code>[.discourse-part]</Code> annotation.
    </Para>
    <Snippet trigger="dp" expansion="[.discourse-part]" />
    <Pair id="discourse" emphasize={[1, 6]} />

    <H2>Italicizing Discourse Identifiers:</H2>
    <Para>
      The words <i>Question</i>, <i>Answer</i>, <i>Objection</i>, and <i>Inquiry</i> that
      begin a discourse-part paragraph will be <b>automatically italicized</b>. (See above
      asciidoc example.) Also,{' '}
      <i>
        "Answer <b>X</b>"
      </i>{' '}
      where <Code>X</Code> is a number will also be automatically italicized. Other{' '}
      <i>non-standard discourse identifiers</i> besides these need to manually italicized,
      as shown below:
    </Para>
    <Note>
      Even when the speakers need to be manually italicized, the paragraphs should{' '}
      <i>still be marked up</i> as <Code>[.discourse-part]</Code>. This class also creates
      spacing between the items, removes text-indent, and provides better semantics.
    </Note>
    <Pair id="discourse-non-standard" emphasize={[2, 5, 8]} />
  </Section>
);
