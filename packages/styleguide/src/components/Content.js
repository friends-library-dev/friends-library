// @flow
import * as React from 'react';
import styled from 'styled-components';
import * as sections from '../sections';

const StyledContent = styled.section`
  background: rgba(239, 239, 239, 0.7);
  padding: 0.5em 35px 1em 325px;
  min-height: 100vh;
`;

export default () => (
  <StyledContent>
    <sections.Emphasis />
    <sections.Quotes />
    <sections.Epigraphs />
    <sections.ChapterHeadings />
    <sections.ChapterSynopsis />
    <sections.SubHeadings />
    <sections.Breaks />
    <sections.Footnotes />
    <sections.Letters />
    <sections.Discourse />
    <sections.Poetry />
    <sections.Styling />
    <sections.Gotchas />
  </StyledContent>
);
