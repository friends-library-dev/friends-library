// @flow
import * as React from 'react';
import styled from 'styled-components';
import { Pair, H1, H2, Para, Code, Section, Note } from '../components';

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
      This should be used <i>sparingly</i>, mostly for situations
      where a long, wrapping heading would be less clear, and particularly
      when the title logically breaks into chunks, with the first chunk
      being the most important.
    </Para>
    <Pair id="chapter-breaks" />

    <H2>Blurb-style chapter headings</H2>

    <Para>
      Some chapter headings are long and weird. They can be designated
      in an alternate <i>blurb</i> style by adding a <Code>[.style-blurb]</Code> class
      above the heading.
    </Para>

    <Note>
      Long titles still need to be kept on a single line, which will cause
      some wrapping, as seen below (in line 2). That's OK. 👍
    </Note>
    <Pair id="chapter-blurb" />

    <H2>Chapter <i>subtitle</i> blurbs</H2>
    <Para>
      Another form of chapter heading is a heading whose subtitle is
      long and <i>blurb-like</i>. These are marked up a bit differently,
      with a paragraph directly below the chapter heading with the
      class <Code>[.chapter-subtitle--blurb]</Code> added. See
      lines 3-6 below:
    </Para>
    <Pair id="chapter-subtitle-blurb" />
  </Section>
);
