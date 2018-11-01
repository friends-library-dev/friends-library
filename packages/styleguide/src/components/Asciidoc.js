// @flow
import * as React from 'react';
import styled from 'styled-components';
import leftPad from 'left-pad';
import frags from '../../dist/frags';

const Wrap = styled.div`
  background: #333;
  padding: 1.6em 0 1.6em 1em;
  line-height: 1.425em;
  padding-left: 0;
  color: #bbb;
  margin-bottom: 40px;
  font-size: 15px;
  position: relative;
  font-family: Menlo, Consolas, "DejaVu Sans Mono", monospace;

  &::before {
    content: 'ASCIIDOC';
    position: absolute;
    top: 5px;
    right: 5px;
    font-size: 11px;
    opacity: 0.3;
  }
   & + .rendered-adoc {
     margin-top: -40px;
   }
`;

const Number = styled.span`
  position: absolute;
  padding-left: 10px;
  left: 0;
  top: 0;
  opacity: 0.225;
  line-height: 1.25em;
  margin: 0;
  user-select: none;
  .highlight & {
    opacity: 1;
    color: rgba(0, 255, 0, 0.5);
    &::before {
      color: #000;
      content: "👉";
      position: absolute;
      text-shadow: 0.75px 0.75px 0.75px #888;
      left: -30px;
      top: 1px;
      font-size: 23px;
    }
  }
`;

const Line = styled.div`
  position: relative;
  padding-right: 20px;
`;

const LineText = styled.span`
  display: block;
  padding-left: 48px;
  color: #abb2bf;
  & .asciidoc--i {
    color: #c678dd;
    font-style: italic;
  }
  & .asciidoc--blue {
    color: #61afef;
  }
  & .asciidoc--normal {
    color: #abb2bf;
  }
  & .asciidoc--white {
    color: white;
    font-weight: bold;
  }
  & .asciidoc--grey {
    color: rgba(171, 178, 191, 0.5);
  }
  & .asciidoc--red {
    color: #cc6b73;
  }
  & .asciidoc--green {
    color: #98c379;
  }
  & .asciidoc--orange {
    color: #d19a66;
  }
`;

const LineNumber = ({ num }) => <Number>{leftPad(num, 2, '0')}.</Number>;

type Props = {
  id: string,
  emphasize?: Array<number>,
};

let inVerse;
let inFootnote;

export default ({ id, emphasize }: Props) => {
  inVerse = false;
  inFootnote = false;
  const adoc = frags[id].adoc.trim().replace(/^== Generated\n\n/, '');
  const lines = adoc.split('\n');
  return (
    <Wrap className="asciidoc">
      {lines.map((line, i) => {
        const emphasized = emphasize && emphasize.includes(i + 1);
        return (
          <Line className={`asciidoc__line${emphasized ? ' highlight' : ''}`} key={i}>
            <LineNumber num={i + 1} />
            <LineText dangerouslySetInnerHTML={{ __html: enhance(line) || '&#8203;' }} />
          </Line>
        );
      })}
    </Wrap>
  );
};

function enhance(line) {
  return line
    .replace(
      /\+\+\+(.+?)\+\+\+/g,
      '{orange}+++{/}{green}$1{/}{orange}+++{/}',
    )
    .replace(
      /(.+)::$/,
      '{white}$1{/}{red}::{/}',
    )
    .replace(
      /("`|'`)(.+?)(`"|`')/g,
      '{orange}<i>$1$2$3</i>{/}',
    )
    .replace(
      /^--$/,
      '{blue}--{/}',
    )
    .replace(
      /footnote:\[(.+)\]/, // single-line footnotes
      '{blue}footnote{/}:[{green}$1{/}]'
    )
    .replace(
      '{footnote-paragraph-split}',
      '{grey}{footnote-paragraph-split}{/}'
    )
    .replace(
      /footnote:\[([^\]]+)$/g, // start of multi-line footnote
      (_, rest) => {
        inFootnote = !inFootnote;
        return `{blue}footnote{/}{normal}:[{/}{green}${rest}{/}`;
      }
    )
    .replace(
      /^\[(verse|quote)(.+)?\]$/,
      (_, type, rest) => `{i}[{/}{blue}<i>${type}</i>{/}${cite(rest)}{i}]{/}`,
    )
    .replace(
      /^____$/,
      () => {
        inVerse = !inVerse;
        return '{i}____{/}'
      }
    )
    .replace(
      /^(`? +)/,
      (orig, pre) => {
        if (!inFootnote) {
          return orig;
        }
        return pre.replace(/ /g, '&nbsp;');
      }
    )
    .replace(
      /(.+)\](.+)?/,
      (orig, before, after) => {
        if (!inFootnote) {
          return orig;
        }
        inFootnote = false;
        return `{green}${before}{/}]${after || ''}`;
      }
    )
    .replace(
      /(__?)([^ \_].+?)\1/igm,
      '{i}$1$2$1{/}',
    )
    .replace(
      /(^=.+)/igm,
      '{white}$1{/}',
    )
    .replace(
      /^\[(\.|#)(.+)\]$/g,
      (_, start, inner) => {
        inner = inner.replace(/\./g, '{white}.{/}');
        return `{white}[${start}{/}{grey}${inner}{/}{white}]{/}`;
      },
    )
    .replace(
      /, short="/g,
      '{white},{/} short="',
    )
    .replace(
      /^\* /,
      '{red}*{/} ',
    )
    .replace(
      /(^.+$)/,
      (_, l) => inVerse ? `{i}${l}{/}` : l,
    )
    .replace(
      /(^.+$)/,
      (_, l) => inFootnote ? `{green}${l}{/}` : l,
    )
    .replace(
      /{(i|red|blue|grey|white|green|orange|normal)}/g,
      '<span class="asciidoc--$1">'
    )
    .replace(
      /{\/}/g,
      '</span>'
    )
}

function cite(text) {
  if (!text) {
    return '';
  }
  return `{grey}<i>${text}</i>{/}`
    .replace(/(\.|,)/g, '{i}$1{/}');
}
