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
        content: '¶ ';
        color: rgba(0, 0, 0, 0.3);
        padding-right: 4px;
      }
    }
  }
`;

type ItemProps = {
  text: string;
  href?: string;
};

const Item = ({ text, href }: ItemProps) => {
  return (
    <li>
      <a href={`#${href || text.toLowerCase().replace(/ /g, '-')}`}>{text}</a>
    </li>
  );
};

Item.defaultProps = { href: '' };

export default () => (
  <StyledSidebar>
    <img
      alt=""
      style={{ width: 90, borderRadius: 20, marginLeft: 10 }}
      src="https://raw.githubusercontent.com/friends-library/friends-library/master/packages/jones/src/assets/george-fox.png"
    />
    <h1
      style={{
        fontSize: 17.5,
        lineHeight: '1.3em',
        position: 'absolute',
        top: 5,
        left: 135,
        color: '#222',
        opacity: 0.8,
        fontFamily: 'Georgia',
        fontWeight: 200,
      }}
    >
      Friends
      <br />
      Library
      <br />
      Publishing
      <br />
      <i style={{ color: '#d62529' }}>Styleguide</i>
    </h1>
    <ul style={{ marginTop: 30 }}>
      <Item text="Emphasis" />
      <Item text="Quotes" />
      <Item text="Epigraphs" />
      <Item text="Chapter Headings" />
      <Item text="Chapter Synopsis" />
      <Item text="Sub-Headings" />
      <Item text="Breaks &amp; Offsets" href="breaks" />
      <Item text="Footnotes" href="footnotes-section" />
      <Item text="Signed Sections" href="letters" />
      <Item text="Discourse" />
      <Item text="Poetry" />
      <Item text="Misc. Styling" href="styling" />
      <Item text="Gotchas!" href="gotchas" />
      <Item text="Videos" href="videos" />
    </ul>
  </StyledSidebar>
);
