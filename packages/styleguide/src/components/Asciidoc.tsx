import * as React from 'react';
import styled from 'styled-components';
import LineNumber from './LineNumber';
import LineText from './LineText';
import { adoc as getAdoc } from '../frags';

const StyleDiv = styled.div`
  background: #333;
  padding: 1.6em 0 1.6em 1em;
  line-height: 1.425em;
  padding-left: 0;
  color: #bbb;
  margin-bottom: 40px;
  font-size: 15px;
  position: relative;
  font-family: Menlo, Consolas, 'DejaVu Sans Mono', monospace;

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

const Line = styled.div`
  position: relative;
  padding-right: 20px;
`;

interface Props {
  id: string;
  emphasize?: number[];
}

let inVerse: boolean;
let inFootnote: boolean;

const Asciidoc: React.SFC<Props> = ({ id, emphasize }) => {
  inVerse = false;
  inFootnote = false;
  const adoc = getAdoc(id)
    .trim()
    .replace(/^== Generated\n\n/, '');
  const lines = adoc.split('\n');
  return (
    <StyleDiv className="asciidoc">
      {lines.map((line, i) => {
        const lineNumber = i + 1;
        const emphasized = emphasize && emphasize.includes(lineNumber);
        return (
          <Line
            className={`asciidoc__line${emphasized ? ' highlight' : ''}`}
            key={`${id}-${lineNumber}`}
          >
            <LineNumber num={lineNumber} />
            <LineText dangerouslySetInnerHTML={{ __html: colorize(line) || '&#8203;' }} />
          </Line>
        );
      })}
    </StyleDiv>
  );
};

Asciidoc.defaultProps = {
  emphasize: [],
};

export default Asciidoc;

function colorize(line: string): string {
  return line
    .replace(/\+\+\+(.+?)\+\+\+/g, '{orange}+++{/}{green}$1{/}{orange}+++{/}')
    .replace(/(.+)::$/, '{white}$1{/}{red}::{/}')
    .replace(/("`|'`)(.+?)(`"|`')/g, '{orange}<i>$1$2$3</i>{/}')
    .replace(/^--$/, '{blue}--{/}')
    .replace(
      /footnote:\[(.+)\]/, // single-line footnotes
      '{blue}footnote{/}:[{green}$1{/}]',
    )
    .replace('{footnote-paragraph-split}', '{grey}{footnote-paragraph-split}{/}')
    .replace(
      /footnote:\[([^\]]+)$/g, // start of multi-line footnote
      (_, rest) => {
        inFootnote = !inFootnote;
        return `{blue}footnote{/}{normal}:[{/}{green}${rest}{/}`;
      },
    )
    .replace(
      /^\[(verse|quote)(.+)?\]$/,
      (_, type, rest) => `{i}[{/}{blue}<i>${type}</i>{/}${cite(rest)}{i}]{/}`,
    )
    .replace(/^____$/, () => {
      inVerse = !inVerse;
      return '{i}____{/}';
    })
    .replace(/^(`? +)/, (orig, pre) => {
      if (!inFootnote) {
        return orig;
      }
      return pre.replace(/ /g, '&nbsp;');
    })
    .replace(/(.+)\](.+)?/, (orig, before, after) => {
      if (!inFootnote) {
        return orig;
      }
      inFootnote = false;
      return `{green}${before}{/}]${after || ''}`;
    })
    .replace(/(__?)([^ _].+?)\1/gim, '{i}$1$2$1{/}')
    .replace(/(^=.+)/gim, '{white}$1{/}')
    .replace(/^\[(\.|#)(.+)\]$/g, (_, start, inner) => {
      inner = inner.replace(/\./g, '{white}.{/}');
      return `{white}[${start}{/}{grey}${inner}{/}{white}]{/}`;
    })
    .replace(/\[\.([a-z_]+?)\]#([^#]+)#/, '{grey}[.$1]{/}{pink}#$2#{/}')
    .replace(/, short="/g, '{white},{/} short="')
    .replace(/^\* /, '{red}*{/} ')
    .replace(/(^.+$)/, (_, l) => (inVerse ? `{i}${l}{/}` : l))
    .replace(/(^.+$)/, (_, l) => (inFootnote ? `{green}${l}{/}` : l))
    .replace(
      /{(i|red|blue|grey|white|green|orange|normal|pink)}/g,
      '<span class="asciidoc--$1">',
    )
    .replace(/{\/}/g, '</span>');
}

function cite(text?: string): string {
  if (!text) {
    return '';
  }
  return `{grey}<i>${text}</i>{/}`.replace(/(\.|,)/g, '{i}$1{/}');
}
