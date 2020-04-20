import * as React from 'react';
import styled from 'styled-components';
import { Pair, H1, H2, Para, Code, Section, Note, Snippet } from '../components';

const EmbeddedTypes = styled.ul`
  li {
    position: relative;
  }
  span {
    font-size: 0.65em;
  }
  span:before {
    content: '--';
    padding-right: 0.25em;
  }
`;

const Letters: React.FC = () => (
  <Section id="letters">
    <H1>Letters &amp; Signed Sections</H1>
    <Note>
      This section begins by explaining each <b>element</b> of a letter or signed-section.
      But keep in mind that in <i>most</i> (but not all!) cases, these elements should be
      used <i>within an embedded content document block</i>, which is explained farther
      down. 👍
    </Note>

    <H2 style={{ marginTop: 0 }}>Salutations:</H2>
    <Para>
      Letter <b>salutations</b> are designated on their own lines with the class{' '}
      <Code>[.salutation]</Code>:
    </Para>
    <Snippet trigger="sal" expansion="[.salutation]" />
    <Pair id="salutation" emphasize={[1]} />

    <H2>Opening Context:</H2>
    <Para>
      Letters or other signed sections often have a line indicating the{' '}
      <i>context or place from which they were written</i>. When this context appears at
      the <b>beginning of the section,</b> it should be designated with the class{' '}
      <Code>[.signed-section-context-open]</Code>
    </Para>
    <Snippet trigger="ssco" expansion="[.signed-section-context-open]" />
    <Pair id="opening-context" emphasize={[1]} />

    <H2>Letter Headings:</H2>
    <Para>
      Frequently letters have a <i>heading</i> or <i>title</i> indicating what the letter
      is. This is often just the correspondents' names. Letter headings are designated
      with the class <Code>[.letter-heading]</Code>.
    </Para>
    <Snippet trigger="lh" expansion="[.letter-heading]" />
    <Pair id="letter-heading" emphasize={[1]} />

    <H2>Signatures:</H2>
    <Para>
      Signatures are designated by the class <Code>[.signed-section-signature]</Code>
    </Para>
    <Snippet trigger="sss" expansion="[.signed-section-signature]" />
    <Pair id="signature" emphasize={[5]} />

    <H2>Closing Context:</H2>
    <Para>
      Letters or other signed sections often have a line indicating the{' '}
      <i>context or place from which they were written</i>. When this context appears at
      the <b>end of the section,</b> it should be designated with the class{' '}
      <Code>[.signed-section-context-close]</Code>
    </Para>
    <Snippet trigger="sscc" expansion="[.signed-section-context-close]" />
    <Pair id="closing-context" emphasize={[10]} />

    <H2>Closing:</H2>
    <Para>
      Occasionally, a Quaker letter will have what is generally considered a{' '}
      <i>closing</i>, equivalent to <i>Sincerely,</i> in a modern letter. These are
      designated with the class <Code>[.signed-section-closing]</Code>:
    </Para>
    <Snippet trigger="sscl" expansion="[.signed-section-closing]" />
    <Note>
      It's tempting to take any single-sentence final paragraph of a letter and consider
      it a closing, but I think it's better to save this designation for very short
      phrases that seem to strongly indicate something akin to the more modern closing.
      But I'm open to input here. 🤔
    </Note>
    <Pair id="closing" emphasize={[5]} />

    <H2>Repeated Letter Elements:</H2>
    <Para>When necessary, the following letter elements can be repeated:</Para>
    <ul>
      <li>opening context</li>
      <li>signature</li>
      <li>closing context</li>
    </ul>
    <Pair id="doubled-letter-elements" emphasize={[1, 4, 14, 17, 20, 23]} />

    <H2>Embeded Content Documents:</H2>
    <Para>
      Many of our books contain letters or signed sections that are <i>embedded</i> within
      a larger section, like a chapter. These sorts of sections need to be demarcated by
      special asciidoc markers. Before they begin, you must add a line with the class{' '}
      <Code>[.embedded-content-document.{'<TYPE>'}]</Code> where <Code>{'<TYPE>'}</Code>{' '}
      is replaced by a class indicating type <i>type</i> of embedded document it is. You
      can choose from the following types:
    </Para>
    <EmbeddedTypes>
      <li>
        <Code>letter</Code>{' '}
        <span>
          most common - addressed <i>specifically</i> to <i>one or a few</i> individuals
        </span>
      </li>
      <li>
        <Code>epistle</Code>{' '}
        <span>
          a writing directed to a group of Friends <i>not specifically named</i>
        </span>
      </li>
      <li>
        <Code>address</Code>{' '}
        <span>
          a writing directed generally to non-Friends (like all magistrates, parlaiment,
          priests)
        </span>
      </li>
      <li>
        <Code>testimony</Code> <span>testimony from an individual or a meeting</span>
      </li>
      <li>
        <Code>paper</Code>{' '}
        <span>
          use if the context explicitly indicates it is a paper (e. g. "...I then gave
          forth this <i>paper"</i>)
        </span>
      </li>
      <li>
        <Code>legal</Code>{' '}
        <span>
          legal documents (mittimus, warrant, court order, prisoner transfer instructions,
          etc.)
        </span>
      </li>
      <li>
        <Code>minute</Code>{' '}
        <span>
          an official <em>minute</em> from a Friends meeting
        </span>
      </li>
      <li>
        <Code>prayer</Code> <span>a written prayer embedded in a document (rare)</span>
      </li>
      <li>
        <Code>treatise</Code>{' '}
        <span>a written work dealing formally with a specific subject (rare)</span>
      </li>
    </EmbeddedTypes>
    <Para>
      After the class designation, on a new line there must be two dashes <Code>--</Code>,
      which in asciidoc begins a generic block.
    </Para>
    <Para>
      Finally, after the end of the letter or section, you also add a line with just two
      dashes <Code>--</Code> (surrounded by empty lines) to close the section. Below is a
      simple (but representative) example:
    </Para>
    <Snippet trigger="ed" expansion={'.embedded-content-document.TYPE\n--'} />
    <Pair id="embedded-letter" emphasize={[5, 6, 18]} />

    <H2>Postscripts:</H2>
    <Para>
      Postscripts are designated with the <Code>[.postscript]</Code> class, and should be
      kept <b>inside an embedded letter block</b>.
    </Para>
    <Pair id="postscript" emphasize={[14, 18]} />

    <H2>Non-Embedded Signed Sections:</H2>
    <Para>
      Not all <i>signed sections</i> are embedded. A good example is a signed forward, or
      a chapter which is a <i>testimony</i>, both of which usually have a signature and
      sometimes a closing context, but should <i>not</i> be wrapped as an{' '}
      <i>embedded content document</i>.
    </Para>
    <Pair id="forward" />

    <H2>Bare Embedded Documents</H2>
    <Para>
      An <i>embedded content document</i> does not need to have a salutation, context, or
      signature. As long as it is truly a <i>document embedded in the chapter</i>, it can
      be marked up as such:
    </Para>
    <Pair id="bare-embedded" />
  </Section>
);

export default Letters;
