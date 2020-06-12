import * as React from 'react';
import { Pair, H1, H2, Para, Code, Section, Note, Snippet } from '../components';

const Styling: React.FC = () => (
  <Section id="styling">
    <H1>Misc. Styling</H1>

    <H2>Book Titles:</H2>
    <Para>
      <b>Book titles</b> should be indicated with an inline class, and <Code>#</Code>
      {` `}
      delimiters, like so: <Code>[.book-title]#TITLE#</Code> and <i>not</i> with plain
      italics:
    </Para>
    <Pair id="book-title" />
    <Snippet trigger="bt" expansion="[.book-title]#" />

    <H2>Underlining</H2>

    <Para>
      <i>Underlining</i> can be achieved with an inline class, like so:{` `}
      <Code>[.underline]#TEXT HERE#</Code>.
    </Para>

    <Note>
      Underlining should be used <i>very sparingly</i>, for emphasizing text that is
      already italicized, or for extreme emphasis, or if the original text contains it,
      and it seems warranted. It should not be used for styling headings.
    </Note>

    <Pair id="underline" emphasize={[12]} />

    <H2>Definition Lists:</H2>
    <Para>
      <b>Definition lists</b> are lists of pairs, usually comprising a word or phrase and
      it's meaning. They are created by typing the word or phrase on one line followed by
      a <Code>::</Code>, then the definition on the next line:
    </Para>
    <Pair id="definition-list" />
    <Para>
      Definition lists <i>don't need to be strictly pairs of definitions.</i> Sometimes
      they are appropriate for a <b>group of labeled chunks,</b> like below:
    </Para>
    <Pair id="definition-list-alt" />

    <H2>Numbered Paragraphs:</H2>
    <Para>
      Fairly often our books will contain chunks of text that include{` `}
      <b>numbered paragraphs</b>. These paragraphs often begin with arabic numbers, or
      with words like <i>First</i>, or <i>Secondly</i>. When, according to our judgment,
      these paragraphs convey some kind of structural meaning that should be represented
      in the formatting, use the <Code>[.numbered]</Code> class, as shown below. The
      numbered class creates automatic spacing between paragraphs and also removes the
      text-indent, causing these paragraphs to stand out from the surrounding text.
    </Para>
    <Snippet trigger="num" expansion="[.numbered]" />
    <Pair id="numbered" emphasize={[1, 7]} />
    <Note>
      The above asciidoc snippet uses <Code>+++</Code> to <i>escape</i> the period. See
      {` `}
      <a href="#gotchas">Gotchas</a> for more on why.
    </Note>
    <Para>
      Frequently, numbered sections will begin with full words, which sometimes{` `}
      <i>should be rendered with italics:</i>
    </Para>
    <Pair id="numbered-alt" />

    <H2>Centered Text:</H2>
    <Para>
      To center a paragraph, add the <Code>.centered</Code> class:
    </Para>
    <Pair id="centered" emphasize={[1]} />
    <Note>
      Use of the <Code>.centered</Code> class is generally discouraged, as it conveys no
      {` `}
      <i>meaning,</i> it's purely a presentational direction. Prefer instead other methods
      of adding a structural meaning to an element, if possible. However, sometimes we do
      need to hold our nose and add a presentational directive like this to achieve the
      formatting we want for the finished books.
    </Note>

    <H2>Empasized Text:</H2>
    <Para>
      To apply italics to an entire paragraph, add the <Code>.emphasized</Code> class:
    </Para>
    <Pair id="emphasized" emphasize={[1]} />
    <Note>
      As with the <Code>.centered</Code> above, try to use this <Code>.emphasized</Code>
      {` `}
      class sparingly, preferring classes and block types with structural meaning.
    </Note>

    <H2>Combining Classes:</H2>
    <Para>
      Any "classes" in asciidoc can be combined by chaining them together, like{` `}
      <Code>[.centered.emphasized]</Code>:
    </Para>
    <Pair id="centered-emphasized" emphasize={[1]} />
    <Note>
      As an example of abusing these presentational classes, you might consider the
      temptation to mark up a scrap of poetry using this method, with{` `}
      <Code>[.centered.emphasized]</Code>. Instead, use a{` `}
      <a href="#poetry">verse block</a>, which will provide both proper styling and
      correct semantics.
    </Note>

    <H2>Syllogisms</H2>

    <Para>
      To denote a list of arguments in a <i>syllogism</i>, use the asciidoc unordered list
      (lines starting with <Code>*</Code>) and the class <Code>[.syllogism]</Code>:
    </Para>

    <Pair id="syllogism" emphasize={[6, 7, 8, 9]} />

    <H2>The End:</H2>

    <Para>
      A small number of our books end with a single paragraph saying something like{` `}
      <i>THE END</i> or <i>FINIS</i>, because I think this was a relatively common
      publishing convention. At least in the <i>original editions</i> I've been leaving
      these intact, but I designate them with the class <Code>[.the-end]</Code> so that I
      can style them appropriately:
    </Para>
    <Pair id="the-end" emphasize={[7]} />

    <H2>Intermediate Titles:</H2>

    <Para>
      <b>Intermediate titles</b> are used to indicate major section breaks (larger than
      chapters) in a document, and in paperbacks and ebooks they are rendered on their own
      page. They are created in their own file, they{` `}
      <b>must have the class designation</b> <code>.intermediate-title</code>, plus an ID,
      and a usually a <em>short title</em>, which will be used for the table of contents.
      The <code>h3.division</code> markup is a useful convention for supplying the
      numbered division of the book, like a volume or book number.
    </Para>
    <Pair id="intermediate-title" emphasize={[1]} />
  </Section>
);

export default Styling;
