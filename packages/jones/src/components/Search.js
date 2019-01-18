// @flow
import * as React from 'react';
import styled from '@emotion/styled/macro';
import { connect } from 'react-redux';
import type { Dispatch, File, SearchResult as SearchResultType } from '../type';
import * as actions from '../actions';
import { searchedFiles } from '../select';
import { searchFiles } from '../lib/search';
import Button from './Button';
import SearchResult from './SearchResult';

const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  background: #000;
  padding: 1.5em 0 0 1.5em;
  height: 65vh;
  flex: 0 0 auto;
  color: white;
  position: relative;
  box-sizing: border-box;

  & .close {
    position: absolute;
    top: 5px;
    right: 5px;
  }
`;

const Results = styled.div`
  overflow: hidden;
  height: 100%;
  overflow: auto;
`;

const SearchBar = styled.div`
  padding-right: 1.5em;
  display: flex;
  flex-direction: row;

  & input {
    flex-grow: 1;
    background: #333;
    color: #ddd;
    padding: 0 8px;
    font-size: 20px;
    font-family: monospace;
    border: none;
  }
`;

const SearchSummary = ({ results }: {| results: Array<SearchResultType> |}) => {
  if (results.length === 0) {
    return <p>Found no results. ¯\_(ツ)_/¯</p>;
  } else if (results.length === 1) {
    return <p>Found <code>1</code> result:</p>
  } else {
    return <p>Found <code>{results.length}</code> results:</p>
  }
}

type Props = {|
  files: Array<File>,
  searching: boolean,
  regexp: boolean,
  caseSensitive: boolean,
  cancelSearch: Dispatch,
  update: Dispatch,
|};

type State = {|
  string: string,
  results: Array<SearchResultType>,
  searchComplete: boolean,
|};

class Search extends React.Component<Props, State> {
  state = {
    searchComplete: false,
    string: '',
    results: [],
  }

  onChangeSearchTerm = (e) => {
    this.setState({
      string: e.target.value,
      searchComplete: false,
      results: [],
    });
  }

  search = () => {
    const { string } = this.state;
    const { update, files, regexp, caseSensitive } = this.props;
    if (string.trim()) {
      update({ string });
      const results = searchFiles(string, files, regexp, caseSensitive);
      this.setState({ results, searchComplete: true });
    }
  }

  cancelSearch = () => {
    const { cancelSearch } = this.props;
    cancelSearch();
    this.setState({ string: '', results: [] });
  }

  render() {
    const { string, results, searchComplete } = this.state;
    const { searching } = this.props;
    if (!searching) {
      return null;
    }

    return (
      <SearchWrap>
        <div>
          <SearchBar>
            <i
              className="close fas fa-times-circle"
              onClick={this.cancelSearch}
            />
            <input
              value={string}
              onChange={this.onChangeSearchTerm}
              onKeyPress={event => {
                if (event.key === 'Enter') {
                  this.search();
                }
              }}
            />
            <Button secondary onClick={this.search} height={35}>
              <i className="fas fa-search" />
              &nbsp;Search
            </Button>
          </SearchBar>
          {searchComplete && <SearchSummary results={results} />}
        </div>
        <Results>
          {results.map((r, i) => <SearchResult result={r} key={`${r.filename}-${i}`} />)}
        </Results>
      </SearchWrap>
    );
  }
}

const mapState = state => {
  const { search: { searching } } = state;
  return {
    files: searchedFiles(state),
    searching,
    regexp: false,
    caseSensitive: false,
  };
};

const mapDispatch = {
  cancelSearch: actions.cancelSearch,
  update: actions.updateSearch,
};

export default connect(mapState, mapDispatch)(Search);
