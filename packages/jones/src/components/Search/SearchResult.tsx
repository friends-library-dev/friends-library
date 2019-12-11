import * as React from 'react';
import styled from '@emotion/styled/macro';
import { connect } from 'react-redux';
import { SearchResult as SearchResultType, Dispatch } from '../../type';
import SearchResultActions from './SearchResultActions';
import SearchResultPreview from './SearchResultPreview';
import * as actions from '../../actions';

const SearchResult = styled.div`
  position: relative;
  padding-right: 1.2em;
  padding-bottom: 1.5em;
  color: #aaa;

  &:hover .result-actions {
    opacity: 0.85;
  }

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

interface Props {
  result: SearchResultType;
  replace: string;
  edit: Dispatch;
  number: number;
  replaceInResult: Dispatch;
  dismiss: () => void;
}

const Component: React.FC<Props> = ({
  result,
  replace,
  number,
  edit,
  dismiss,
  replaceInResult,
}) => {
  if (result.dismissed) {
    return null;
  }
  return (
    <SearchResult>
      <SearchResultActions
        dismiss={dismiss}
        replace={() => replaceInResult({ result, replace })}
        goto={() => edit(result)}
      />
      <ResultHeading>
        Match <code>{number}</code> in file:
        <code className="edition-type">{result.editionType}</code>
        <code className="sep">/</code>
        <code className="filename">{result.filename}</code>
      </ResultHeading>
      <SearchResultPreview result={result} edit={edit} replace={replace} />
    </SearchResult>
  );
};

const mapDispatch = {
  replaceInResult: actions.replaceInResult,
  edit: actions.editSearchResult,
};

export default connect(null, mapDispatch)(Component);
