// @flow
import * as React from 'react';
import { Pair, H1, Para, Section, Snippet } from '../components';

export default () => (
  <Section id="chapter-synopsis">
    <H1>Chapter Synopsis</H1>
    <Para>
      Some of our books contain <i>chapter synopsis</i> chunks right
      after the chapter title. These are marked up in asciidoc as
      shown below:
    </Para>
    <Snippet trigger="cs" expansion="[.chapter-synopsis]" />
    <Pair id="chapter-synopsis" />
  </Section>
);
