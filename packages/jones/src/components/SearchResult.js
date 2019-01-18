// @flow
import * as React from 'react';
import styled from '@emotion/styled/macro';
import { connect } from 'react-redux';
import type { Html } from '../../../../type';
import type { SearchResult as SearchResultType, Dispatch } from '../type';
import * as actions from '../actions';

const ResultWrap = styled.div`
  padding-right: 1.2em;
  padding-bottom: 1.5em;
  color: #aaa;

  code {
    font-size: 0.85em;
    padding: 0 0.35em;
    background: #111;
  }

  .sep {
    padding: 0;
    opacity: 0.5;
  }

  .edition-type {
    color: #b0b66c;
    margin-left: 0.25em;
  }

  .filename {
    color: var(--accent);
  }

  & + & {
    border-top: dashed 1px #333;
  }
`;

const ResultHeading = styled.p`
  margin: 0;
  padding: 1em 0;
`;

type Props = {|
  result: SearchResultType,
  edit: Dispatch,
|};

const SearchResult = ({ result, edit }: Props) => {
  return (
    <ResultWrap>
      <ResultHeading>
        Match in file:
        <code className="edition-type">{result.editionType}</code>
        <code className="sep">/</code>
        <code className="filename">{result.filename}</code>
      </ResultHeading>
      <Preview result={result} edit={edit} />
    </ResultWrap>
  );
};

const PreviewWrap = styled.div`
  color: white;
  background: #222;
  font-family: monospace;
  margin-left: 30px;
`;

const LineNumber = styled.span`
  opacity: 0.4;
  margin: 0 0.5em 0 0.3em;
  text-align: right;
  width: 2.5em;
`;

const Line = styled.div`
  line-height: 1.3em;
  display: flex;
  flex-wrap: nowrap;

  .content {
    flex-grow: 1;
    overflow: hidden;
    position: relative;
  }

  .content-inner {
    position: absolute;
    top: 0;
    left: 0;
    white-space: pre-line;
  }

  b {
    font-weight: 700;
    background: green;
    cursor: ne-resize;
  }
`;

const Preview = ({ result, edit }: { result: SearchResultType, edit: (any) => * }) => {
  return (
    <PreviewWrap onClick={e => {
      if (e.target.nodeName === 'B') {
        edit(result);
      }
    }}>
      {result.context.map((line, index, lines) => (
        <Line key={line.lineNumber}>
          <LineNumber>
            {line.lineNumber}
          </LineNumber>
          <div className="content">
            <span className="content-inner" dangerouslySetInnerHTML={{
              __html: lineContent(line, index, result),
            }}/>
          </div>
        </Line>
      ))}
    </PreviewWrap>
  );
};


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

const mapDispatch = {
  edit: actions.editSearchResult,
};

export default connect(null, mapDispatch)(SearchResult);
