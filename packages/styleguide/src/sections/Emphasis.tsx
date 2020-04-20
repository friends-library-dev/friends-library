import * as React from 'react';
import { Pair, H1, Para, Code, Section, Note, Asciidoc } from '../components';

const editorUrl = 'https://flp-editor.netlify.com';

const Emphasis: React.FC = () => (
  <Section id="emphasis">
    <H1>Emphasis (italic)</H1>
    <Para>
      Use underscores <Code>_</Code> for basic emphasis.
    </Para>
    <Note>
      In the <a href={editorUrl}>Online Editor</a>, you can highlight a chunk of
      non-italicized text and press <code>Cmd+I</code> or <code>Ctrl+I</code> and the
      required underscores will be <em>added automatically.</em>
    </Note>
    <Pair id="emphasis-1" />
    <Para>
      You can also use <i>2</i> underscores <Code>__</Code> for emphasis. The only
      difference is that double underscores also work <i>within words</i>, which is not
      true of single underscores:
    </Para>
    <Pair id="emphasis-dunder" />

    <Note>
      Because of the way footnotes work in Asciidoc, if you have italics that{' '}
      <i>directly run into a footnote</i>, you will need to use double-underscores, or
      you'll get an error:
    </Note>
    <Asciidoc id="emphasis-footnote" emphasize={[2]} />

    <Para>
      Italics can span across multiple lines, you won't get nice syntax highlighting, as
      shown below, but it still works.
    </Para>
    <Pair id="emphasis-multiline" />
    <Note>
      Cited <b>book titles</b> should <i>not</i> be denoted using bare italics. Use the{' '}
      <a href="#styling">dedicated syntax</a> instead.
    </Note>
  </Section>
);

export default Emphasis;
