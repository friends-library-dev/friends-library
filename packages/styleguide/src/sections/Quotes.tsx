import * as React from 'react';
import { Pair, H1, H2, Para, Code, Section, Note, Snippet } from '../components';

export default () => (
  <Section id="quotes">
    <H1>Quotes</H1>
    <H2>Inline Quotes:</H2>
    <Para>
      <b>Inline quotations</b> are made with a combination of characters.
    </Para>
    <ul>
      <li>
        <Code>"`</Code> is an <i>open smart quote</i>.
      </li>
      <li>
        <Code>`"</Code> is an <i>close smart quote</i>.
      </li>
      <li>
        <Code>'`</Code> is an <i>open smart apostrophe</i>.
      </li>
      <li>
        <Code>`'</Code> is an <i>close smart apostrophe</i>.
      </li>
    </ul>
    <Pair id="quotes-inline" />
    <Snippet trigger="sqs" acronym="smart quote start" expansion='"`' />
    <Snippet trigger="sqe" acronym="smart quote end" expansion='`"' />
    <Snippet trigger="sas" acronym="smart apostrophe start" expansion="'`" />
    <Snippet trigger="sae" acronym="smart apostrophe end" expansion="`'" />
    <Note>
      As you working with documents, <b>don't fix straight apostrophes</b>. We should be
      able to programatically fix all these at one time, so it's not worth the human
      effort.
    </Note>

    <H2>Multi-line Inline Quotes:</H2>
    <Para>
      Inline quotations work fine when <i>they span multiple lines</i>, but, like italics,
      you <i>lose syntax-highlighting</i>. 😥 For this reason, I sometimes hand-tweak the
      line-breaks to keep short inline quotations on the same line, so they are easier to
      see at a glance.
    </Para>
    <Pair id="quotes-inline-multi" />

    <H2>Block Quotes:</H2>
    <Para>
      Block quotes are designated with an opening line with <Code>[quote]</Code> followed
      by a <b>quote block</b>, which is demarcated by <code>4</code> underscores{' '}
      <Code>____</Code> before <i>and</i> after:
    </Para>
    <Pair id="quote-block" emphasize={[3, 4, 11]} />
    <Snippet trigger="q" expansion={'[quote]\n____'} />

    <H2>Block Quotes with Attribution:</H2>
    <Para>
      Block Quotes can also specify <b>attribution</b> by listing first the source, then
      the location, comma-separated, in the opening line, like this{' '}
      <Code>[quote, AUTHOR, LOCATION]</Code>. The author and location will be rendered{' '}
      <i>below</i> the quote, as shown below:
    </Para>
    <Pair id="quote-cited" emphasize={[1]} />
    <Note>
      As shown in the above example, if the <i>author</i>, or <i>location</i> contains one
      or more <b>commas</b>, you'll need to wrap it with quotation marks.{' '}
      <Code>[quote, "G. Fox, M.D.", "Book, etc."]</Code>
    </Note>
    <Para>
      If you <b>only have a location</b>, you can skip the <i>author</i> by leaving it
      blank:
    </Para>
    <Pair id="quote-cited-no-author" emphasize={[1]} />

    <H2>Scripture Block Quotes</H2>
    <Para>
      For blockquotes that are from <b>scripture</b>, add the class{' '}
      <Code>.scripture</Code>, and an <i>optional</i> citation. Scripture block quotes are
      also italicized.
    </Para>
    <Pair id="quote-scripture" emphasize={[1]} />
    <Snippet trigger="qs" expansion={'[quote.scripture, , ]\n____'} />
    <Note>
      <b>Epigraphs</b> are a special type of block quote, but are covered in{' '}
      <a href="#epigraphs">their own section.</a>
    </Note>
  </Section>
);
