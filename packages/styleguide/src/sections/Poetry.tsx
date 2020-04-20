import * as React from 'react';
import { Pair, H1, H2, Para, Code, Section, Note, Asciidoc } from '../components';

const Poetry: React.FC = () => (
  <Section id="poetry">
    <H1>Poetry</H1>

    <Para>
      Poetry is marked up first with a line containing only <Code>[verse]</Code>, followed
      by the poetry wrapped in a <i>quote block</i> which is demarcated by <code>4</code>{' '}
      underscores <Code>____</Code> before <i>and</i> after.
    </Para>
    <Pair id="poetry" emphasize={[1, 2, 7]} />

    <H2>Poetry with stanzas:</H2>
    <Para>
      <i>Stanzas</i> in poetry are indicated by leaving an <b>extra blank line</b> between
      them:
    </Para>
    <Pair id="poetry-stanzas" emphasize={[7]} />

    <H2>Poetry in footnotes:</H2>
    <Para>
      Poetry appearing in footnotes are not natively supported in the asciidoc format, so
      it needs to be marked up with this crazy made-up syntax I came up with shown below.
      These are rare and weird, so ping Jared if you're having trouble. 🤔
    </Para>
    <Asciidoc id="poetry-footnote" emphasize={[7, 8, 9, 10, 11]} />
    <Note>
      Line 7 above is a backtick <Code>`</Code> followed by <code>4</code> spaces. Lines
      8-11 start with <code>5</code> spaces. Oh, and the last line must terminate with a
      space then another backtick.
    </Note>
    <Note>
      Browsers can't render footnotes like <a href="https://www.princexml.com">Prince</a>{' '}
      can, hence no preview here, sorry. It works, if you do it right, trust me!
    </Note>
  </Section>
);

export default Poetry;
