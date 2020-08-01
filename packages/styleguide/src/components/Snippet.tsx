import * as React from 'react';
import styled from 'styled-components';

const StyledDiv = styled.div`
  background: rgba(202, 235, 242, 0.4);
  border-left: 6px solid rgba(0, 0, 150, 0.4);
  padding: 1.5em;
  margin-bottom: 40px;
  position: relative;
  font-family: monospace;
  font-weight: 200;
  font-size: 16px;
  color: #666;

  & img {
    position: absolute;
    top: 20px;
    left: 22px;
    width: 40px;
    height: 40px;
  }
  & p {
    padding-left: 60px;
    margin: 0;
    line-height: 33px;
  }
  & code {
    color: magenta;
    font-weight: bold;
  }
  & code.trigger {
    text-decoration: underline;
    letter-spacing: 1.5px;
    font-size: 1.1em;
  }
  & .expansion {
    background: rgba(102, 102, 102, 0.8);
    border-radius: 3px;
    color: #eee;
    padding: 4px 6px;
    font-size: 0.8em;
  }
  & .acronym {
    color: #777;
    opacity: 0.8;
    font-size: 0.8em;
    padding: 0 0.65em;

    & .first-letter {
      color: magenta;
      text-decoration: underline;
    }
  }
  & + & {
    margin-top: -16px;
  }
`;

const logo = `https://upload.wikimedia.org/wikipedia/commons/thumb/8/80/Atom_editor_logo.svg/131px-Atom_editor_logo.svg.png`;

interface Props {
  trigger: string;
  expansion: string;
  acronym?: string;
}

const Snippet: React.FC<Props> = ({ trigger, expansion, acronym }) => (
  <StyledDiv>
    <img src={logo} alt="" />
    <p>
      The snippet <code className="trigger">{trigger}</code>
      {` `}
      <Acronym text={acronym || ``} /> will expand to <Expansion expansion={expansion} />
    </p>
  </StyledDiv>
);

Snippet.defaultProps = { acronym: `` };

export default Snippet;

const Expansion: React.FC<{ expansion: string }> = ({ expansion }) => {
  const html = expansion
    .split(`\n`)
    .map((part) => `<span class="expansion">${part}</span>`)
    .join(` and `);
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
};

const Acronym: React.FC<{ text: string }> = ({ text }) => {
  if (!text) {
    return <></>;
  }
  const parts = text.split(` `);
  const inner = parts.reduce((acc, part, index) => {
    acc += `<span class="first-letter">${part[0]}</span>`;
    acc += part.substr(1);
    if (index < parts.length - 1) {
      acc += ` `;
    }
    return acc;
  }, ``);
  const html = `(${inner})`;
  return <span className="acronym" dangerouslySetInnerHTML={{ __html: html }} />;
};
