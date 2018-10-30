// @flow
import * as React from 'react';
import styled from 'styled-components';
import leftPad from 'left-pad';
import frags from '../../dist/frags';

const Wrap = styled.div`
  background: #333;
  padding: 1.6em 1.2em 1.6em 1em;
  line-height: 1.25em;
  padding-left: 0;
  color: #bbb;
  margin-bottom: 0;
  position: relative;
  font-family: monospace;

  &::before {
    content: 'ASCIIDOC';
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 11px;
    opacity: 0.3;
  }
`;

const Number = styled.span`
  position: absolute;
  left: 10px;
  top: 0;
  opacity: 0.225;
  line-height: 1.25em;
  margin: 0;
`;

const Line = styled.div`
  position: relative;
`;

const LineText = styled.span`
  display: block;
  padding-left: 48px;
  color: #abb2bf;
  & .asciidoc--i {
    color: #c678dd;
    font-style: italic;
  }
  & .asciidoc--white {
    color: white;
    font-weight: bold;
  }
  & .asciidoc--grey {
    color: rgba(171, 178, 191, 0.5);
  }
`;

const LineNumber = ({ num }) => <Number>{leftPad(num, 2, '0')}.</Number>;

export default ({ id }: { id: string }) => {
  const adoc = frags[id].adoc.trim().replace(/^== Generated\n\n/, '');
  const lines = adoc.split('\n');
  return (
    <Wrap>
      {lines.map((line, i) => (
        <Line className="asciidoc__line" key={i}>
          <LineNumber num={i + 1} />
          <LineText dangerouslySetInnerHTML={{ __html: enhance(line) || '&nbsp;' }} />
        </Line>
      ))}
    </Wrap>
  );
};

function enhance(line) {
  return line
    .replace(
      /(__?)([^ \_].+?)\1/igm,
      '<span class="asciidoc--i">$1$2$1</span>',
    )
    .replace(
      /(^=.+)/igm,
      '<span class="asciidoc--white">$1</span>',
    )
    .replace(
      /^\[\.(.+)\]$/g,
      '<span class="asciidoc--white">[.</span><span class="asciidoc--grey">$1</span><span class="asciidoc--white">]</span>',
    )
}
