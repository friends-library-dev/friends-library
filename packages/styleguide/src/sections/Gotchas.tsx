import * as React from 'react';
import { Pair, H1, H2, Para, Code, Section, Note } from '../components';

export default () => (
  <Section id="gotchas">
    <H1>Gotchas 😬</H1>
    <H2>Square Brackets:</H2>
    <Para>
      Because <b>square brackets</b> <Code>[ ]</Code> have a special meaning in asciidoc,
      if you want to <i>use them in a document</i>, they must be <i>escaped</i>. In
      general, a reliable way to escape something in asciidoc is to surround it with three
      plus signs <Code>+++</Code>:
    </Para>
    <Pair id="brackets" emphasize={[2]} />

    <H2>Confusing Periods:</H2>
    <Para>
      In asciidoc, when a line{' '}
      <i>starts with a number or capital letter followed by a period</i>, that signifies a
      list item. Therefore, we need to trick asciidoc by <b>escaping the period</b>, as
      shown:
    </Para>
    <Pair id="confusing-periods" emphasize={[2, 6]} />
    <Note>
      You only have to escape the period when the sequence{' '}
      <b>is at the very beginning of the line</b>, which normally means when the sequence{' '}
      <i>begins a sentence.</i>
    </Note>

    <H2>Group of Underscores:</H2>
    <Para>
      A common method for redacting a person's name in our books is to substitute a group
      of underscores: <Code>______</Code>. This sequence has a special meaning in asciidoc
      however, so it too must be escaped:
    </Para>
    <Pair id="underscores" />

    <Note>
      The tool that converts <code>.odt</code> to raw asciidoc for intake{' '}
      <i>takes care of escaping these special cases</i>, so you rarely have to actually
      manually add or edit these sequences. 👍
    </Note>
  </Section>
);
