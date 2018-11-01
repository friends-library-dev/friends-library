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
  <Section id="chapter-synopsis">
    <H1>Chapter Synopsis</H1>
    <Para>
      Some of our books contain <i>chapter synopsis</i> chunks right
      after the chapter title. These are marked up in asciidoc as
      shown below:
    </Para>
    <Snippet trigger="cs" expansion="[.chapter-synopsis]" />
    <Pair id="chapter-synopsis" xemphasize={[3,4,5,6,7,8,9,10]} />
  </Section>
)
