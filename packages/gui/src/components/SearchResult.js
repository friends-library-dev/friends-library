// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import type { Html } from '../../../../type';
import type { SearchResult } from '../redux/type';

const ResultWrap = styled.div`
  margin-right: 1.2em;
  padding-bottom: 1.2em;
  color: #aaa;

  & .filename {
    font-size: 0.85em;
    background: #111;
    color: var(--accent);
    padding: 0 0.35em;
  }
  & + & {
    border-top: dashed 1px #333;
  }
`;

type Props = {|
  result: SearchResult,
|};

export default ({ result }: Props) => (
  <ResultWrap>
    <p>Match in file: <code className="filename">{result.filename}</code></p>
    <Preview result={result} />
  </ResultWrap>
);

const PreviewWrap = styled.div`
  color: white;
  background: #222;
  font-family: monospace;
  margin-left: 30px;
`;

const LineNumber = styled.span`
  opacity: 0.4;
  margin: 0 0.5em 0 0.3em;
`;

const Line = styled.div`
  line-height: 1.3em;
  & b {
    font-weight: 700;
    background: green;
  }
`;

const Preview = ({ result }: { result: SearchResult }) => (
  <PreviewWrap>
    {result.context.map((line, index) => (
      <Line>
        <LineNumber>{line.lineNumber}</LineNumber>
        <span dangerouslySetInnerHTML={{
          __html: lineContent(line, index, result),
        }}
        />
      </Line>
    ))}
  </PreviewWrap>
);


function lineContent(line: Object, index: number, result): Html {
  const { start, end } = result;
  let content = '';
  const isStartLine = line.lineNumber === start.line;
  if (isStartLine) {
    const before = line.content.substring(0, start.column);
    content = `${before}<b>`;
    if (end.line === start.line) {
      const highlighted = line.content.substring(start.column, end.column);
      content += `${highlighted}</b>`;
      content += line.content.substring(end.column);
    }
    return content;
  }
  return line.content;
}
