// @flow
import * as React from 'react';
import styled from 'styled-components';
import * as c from '../cases';

const StyledContent = styled.section`
  background: rgba(239, 239, 239, 0.7);
  padding: 0.5em 35px 1em 325px;
  min-height: 100vh;
`;

export default () => (
  <StyledContent>
    <c.SubHeadings />
    <c.Letters />
    <c.Gotchas />
    <c.Footnotes />
    <c.Styling />
    <c.Epigraphs />
    <c.Quotes />
    <c.Poetry />
    <c.Breaks />
    <c.Discourse />
    <c.ChapterSynopsis />
    <c.ChapterHeadings />
    <c.Emphasis />
  </StyledContent>
);
