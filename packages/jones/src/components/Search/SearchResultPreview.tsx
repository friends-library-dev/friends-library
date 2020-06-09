import * as React from 'react';
import styled from '@emotion/styled/macro';
import { Html } from '@friends-library/types';
import { SearchResult, SearchResultContext, Dispatch } from '../../type';

const SearchResultPreview = styled.div`
  color: white;
  background: #222;
  font-family: monospace;
  margin-left: 15px;
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
  color: #bbb;

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

  .find,
  .replace {
    font-weight: 700;
    color: white;
  }

  .find {
    background: rgba(255, 0, 0, 0.5);
    cursor: ne-resize;
  }

  .replace {
    background: rgba(0, 128, 0, 0.65);
  }
`;

interface Props {
  result: SearchResult;
  edit: Dispatch;
  replace: string;
}

const Component: React.FC<Props> = ({ result, edit, replace }) => {
  return (
    <SearchResultPreview
      onClick={(e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target instanceof Element && e.target.nodeName === `B`) {
          edit(result);
        }
      }}
    >
      {result.context.map((line: SearchResultContext, index: number) => (
        <Line key={line.lineNumber}>
          <LineNumber>{line.lineNumber}</LineNumber>
          <div className="content">
            <span
              className="content-inner"
              dangerouslySetInnerHTML={{
                __html: lineContent(line, index, result, replace),
              }}
            />
          </div>
        </Line>
      ))}
    </SearchResultPreview>
  );
};

export default Component;

function lineContent(
  line: SearchResultContext,
  index: number,
  result: SearchResult,
  replace: string,
): Html {
  const { start, end } = result;
  let content = ``;
  const isStartLine = line.lineNumber === start.line;
  if (isStartLine) {
    const before = line.content.substring(0, start.column);
    content = `${before}<b class="find">`;
    if (end.line === start.line) {
      const highlighted = line.content.substring(start.column, end.column);
      content += `${highlighted}</b><b class="replace">${replace}</b>`;
      content += line.content.substring(end.column);
    }
    return content;
  }
  return line.content;
}
