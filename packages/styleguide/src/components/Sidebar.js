// @flow
import * as React from 'react';
import styled from 'styled-components';

const StyledSidebar = styled.section`
  background: #caebf2;
  height: 100%;
  color: #666;
  padding: 1em;
  width: 260px;
  position: fixed;

  & ul {
    padding: 0;
  }

  & li {
    list-style-type: none;
    line-height: 1.75em;
    margin-bottom: 5px;
    font-size: 19px;
    font-weight: 200;
    font-family: sans-serif;
    padding-left: 12px;

    & a {
      color: #d62529;
      text-decoration: none;

      &::before {
        content: "¶ ";
        color: rgba(0, 0, 0, 0.3);
        padding-right: 4px;
      }
    }
  }
`;


type ItemProps = {
  href?: string,
  text: string,
}

const Item = ({ text, href }: ItemProps) => {
  return (
    <li>
      <a href={`#${href || text.toLowerCase().replace(/ /g, '-')}`}>{text}</a>
    </li>
  );
}

export default () => (
  <StyledSidebar>
    <ul>
      <Item text="Footnotes" href="footnotes-section" />
      <Item text="Misc. Styling" href="styling" />
      <Item text="Quotes" />
      <Item text="Epigraphs" />
      <Item text="Poetry" />
      <Item text="Breaks &amp; Offsets" href="breaks" />
      <Item text="Discourse" />
      <Item text="Chapter Synopsis" />
      <Item text="Chapter Headings" />
      <Item text="Emphasis" />
    </ul>
  </StyledSidebar>
);
