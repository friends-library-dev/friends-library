import * as React from 'react';
import { H1, H2, Para, Code, Section, Note, Asciidoc } from '../components';

const Footnotes: React.FC = () => (
  <Section id="footnotes-section">
    <H1>Footnotes</H1>
    <Note>
      Browsers can't render our footnotes, so all of the examples in this section are only
      shown in asciidoc. You'll need to created PDFs using the CLI app to actually see
      rendered footnotes. Sorry! 😬
    </Note>
    <Para>
      Footnotes in asciidoc are created with the <i>footnote macro</i>, which looks like{' '}
      <Code>footnote:[Some text here]</Code>, as shown below:
    </Para>
    <Asciidoc id="footnote-inline" />

    <Para>
      However, if there's not punctuation before a footnote, the macro runs directly into
      the text, which looks weird, so I created a convention that we can also add a caret{' '}
      <Code>^</Code> and then a newline before the footnote, which is how almost all of
      the footnotes in the existing documents are formatted, shown below:
    </Para>
    <Asciidoc id="footnote" emphasize={[3, 4, 5]} />

    <Para>
      Footnotes can span multiple lines (as shown above and below), and can incorporate
      inline styling within their content, including things like <b>italics</b> and{' '}
      <b>inline quotes</b>:
    </Para>
    <Asciidoc id="footnote-styling" />

    <H2>Multi-paragraph Footnotes:</H2>
    <Para>
      The asciidoc format doesn't natively support <b>multi-paragraph</b> footnotes, so I
      had to invent a syntax for this. Instead of leaving an extra empty line, like normal
      paragraphs, instead insert a line containing only{' '}
      <Code>{'{footnote-paragraph-split}'}</Code>:
    </Para>
    <Asciidoc id="footnote-multi" emphasize={[11]} />
  </Section>
);

export default Footnotes;
