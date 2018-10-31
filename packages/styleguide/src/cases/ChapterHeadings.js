// @flow
import * as React from 'react';
import styled from 'styled-components';
import {
  Pair,
  H1,
  H2,
  Para,
  Code,
  Section,
  Note,
  Snippet,
  Asciidoc,
} from '../components';

export default () => (
  <Section id="chapter-headings">
    <H1>Chapter Headings</H1>
    <Para>
      Chapter headings are placed on a single line starting
      with <i>two</i> equal signs <Code>==</Code>:
    </Para>
    <Pair id="chapter-simple" />

    <Para>
      A numbered chapter title can have a <i>subtitle</i> by
      adding a period and then the subtitle:
    </Para>
    <Pair id="chapter-subtitle" />

    <Para>
      Chapters don't need to have a number, they can just
      be a simple title:
    </Para>
    <Pair id="chapter-non-numbered" />


    <H2>Broken subtitles</H2>
    <Para>
      Chapter heading subtitles can be manually <i>broken</i> onto
      multiple lines using the forward-slash <Code>/</Code> character.
    </Para>
    <Note>
      This technique should be used <i>sparingly</i>, mostly for situations
      where a long, wrapping heading would be less clear, and particularly
      when the title logically breaks into chunks, with the <b>first chunk
      being the most important.</b>
    </Note>
    <Pair id="chapter-breaks" />

    <H2>Blurb-style chapter headings</H2>

    <Para>
      Some chapter headings are long and weird. They can be designated
      in an alternate <i>blurb</i> style by adding a <Code>[.style-blurb]</Code> class
      above the heading.
    </Para>

    <Note>
      Long titles still need to be kept on a single line, which will cause
      some wrapping, as seen below. That's OK. 👍
    </Note>
    <Pair id="chapter-blurb" emphasize={[1]} />

    <H2>Chapter <i>subtitle</i> blurbs</H2>
    <Para>
      Another form of chapter heading is a heading whose subtitle is
      long and <i>blurb-like</i>. These are marked up a bit differently,
      with a paragraph directly below the chapter heading with the
      class <Code>[.chapter-subtitle--blurb]</Code> added.
    </Para>
    <Snippet trigger="csb" expansion="[.chapter-subtitle--blurb]" />
    <Pair id="chapter-subtitle-blurb" emphasize={[3,4,5,6]} />

    <H2>Short titles</H2>

    <Para>
      By default, the chapter titles will be used for running headers and
      the table of contents. This can be problematic with <i>long</i> titles.
      You can specify a shortened version of the title to be used in these
      locations by adding custom <Code>id</Code> and <Code>short</Code> attributes
      separated by a comma, as shown below (line <code>1</code>):
    </Para>
    <Asciidoc id="chapter-short" emphasize={[1]} />
    <Note>
      <Code>id</Code> attributes are specified using the <Code>#</Code> symbol,
      like in CSS. You can add classes at the same time as ids by
      appending a <Code>.</Code>, like <Code>[#the-way.style-blurb]</Code>.
    </Note>
    <Note>
      When adding a short title as shown above, the <Code>id</Code> must
      be unique within the entire book.
    </Note>
  </Section>
);
