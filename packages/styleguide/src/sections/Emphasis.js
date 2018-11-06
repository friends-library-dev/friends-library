// @flow
import * as React from 'react';
import { Pair, H1, Para, Code, Section, Note } from '../components';

export default () => (
  <Section id="emphasis">
    <H1>Emphasis (italic)</H1>
    <Para>
      Use underscores <Code>_</Code> for basic emphasis.
    </Para>
    <Pair id="emphasis-1" />
    <Para>
      You can also use <i>2</i> underscores <Code>__</Code> for emphasis:
    </Para>
    <Pair id="emphasis-dunder" />
    <Para>
      Italics can span across multiple lines, but Atom won't give you nice
      syntax highlighting, as shown below, but it still works.
    </Para>
    <Pair id="emphasis-multiline" />
    <Note>
      Cited <b>book titles</b> should <i>not</i> be denoted using bare
      italics. Use the <a href="#styling">dedicated syntax</a> instead.
    </Note>
  </Section>
);
