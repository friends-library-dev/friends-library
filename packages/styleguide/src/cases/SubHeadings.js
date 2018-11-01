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
  <Section id="sub-headings">
    <H1>Sub-Headings:</H1>
    <H2>Basic Sub-Headings:</H2>
    <Para>
      As noted in the <a href="chapter-headings">chapter-headings</a> section,
      chapter headings use <i>two equals signs</i> <Code>== Some Title</Code>.
      Secondary and tertiary headings can be designated by
      using <i>three</i> or <i>four</i> equals signs, respectively:
    </Para>
    <Pair id="sub-headings" emphasize={[3, 9]} />
    <Note>
      We don't support <i>4th</i> or <i>5th</i> level headings currently, but if we
      felt the need to, it wouldn't be hard.
    </Note>

    <H2>Alternate Sub-Headings:</H2>
    <Para>
      Sub-headings can also be designated with an <Code>[.alt]</Code> class,
      which provides a different presentation. This is a bit of a compromise,
      as it's purely a presentational consideration, but hey!
    </Para>
    <Pair id="sub-headings-alt" emphasize={[1,8]} />

    <H2>"Old-Style" Sub-Headings:</H2>
    <Para>
      Some of our books have sub-headings that seemed to have been influenced
      by the prevailing publishing techniques of the day, where a section title
      would be broken up by phrases onto several lines, usually in all caps.
      These don't always feel right just changed into normal sub-headings, so
      the <Code>[.old-style]</Code> class can be added before the heading,
      with forward slashes <Code>/</Code> designating the phrase breaks:
    </Para>
    <Pair id="old-style" emphasize={[1, 2]} />
    <Para>
      These <i>old-style</i> headings can also take an optional <Code>.bold</Code> class,
      which slightly alters the appearance, causing the secondary lines to
      appear bold, instead of italic, as shown:
    </Para>
    <Pair id="old-style-bold" emphasize={[1]} />

    <H2>Blurb-Style Headings</H2>
    <Para>
      Early Quakers had a habit of making section titles that were long
      sentences.  Because these look weird with normal sub-heading styles,
      a <Code>[.blurb]</Code> class may be added to indicate that the heading
      is a <i>blurb-style</i> heading, giving it an alternate appearance:
    </Para>
    <Pair id="blurb-heading" emphasize={[1]} />

    <H2>Combining Stylistic Classes</H2>
    <Para>
      It is possible to combine style classes on sub-headings for presentational
      reasons.
    </Para>
    <Note>
      This should be used sparingly, but occasionally is helpful.
      I used it a few times when I was trying to match the exact formatting
      of the Isaac Penington books created before we used asciidoc.
    </Note>
    <Pair id="styled-headings" emphasize={[1]} />
  </Section>
)
