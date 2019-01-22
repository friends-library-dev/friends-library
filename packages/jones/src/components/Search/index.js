// @flow
import * as React from 'react';
import styled from '@emotion/styled/macro';
import { connect } from 'react-redux';
import type { Dispatch, File, SearchResult as SearchResultType } from '../../type';
import * as actions from '../../actions';
import { searchedFiles } from '../../select';
import { searchFiles } from '../../lib/search';
import SearchResult from './SearchResult';
import SearchControls from './SearchControls';
import SearchSummary from './SearchSummary';

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


type Props = {|
  files: Array<File>,
  searching: boolean,
  regexp: boolean,
  caseSensitive: boolean,
  cancelSearch: Dispatch,
  update: Dispatch,
  replaceAll: Dispatch,
|};

type State = {|
  searchTerm: string,
  replaceTerm: string,
  results: Array<SearchResultType>,
  searchComplete: boolean,
|};

class Search extends React.Component<Props, State> {
  state = {
    searchComplete: false,
    searchTerm: '',
    replaceTerm: '',
    results: [],
  }

  changeSearchTerm = searchTerm => {
    this.setState({
      searchTerm,
      searchComplete: false,
      results: [],
    });
  }

  changeReplaceTerm = replaceTerm => {
    this.setState({
      replaceTerm,
    });
  }

  search = () => {
    const { searchTerm } = this.state;
    const { update, files, regexp, caseSensitive } = this.props;
    if (searchTerm.trim()) {
      update({ searchTerm });
      const results = searchFiles(
        searchTerm,
        files,
        regexp,
        caseSensitive,
      );
      this.setState({ results, searchComplete: true });
    }
  }

  cancelSearch = () => {
    const { cancelSearch } = this.props;
    cancelSearch();
    this.setState({ searchTerm: '', results: [] });
  }

  dismissResult(index) {
    const { results } = this.state;
    results[index].dismissed = true;
    this.setState({ results });
  }

  replaceAll = () => {
    const { replaceAll } = this.props;
    const { results, replaceTerm } = this.state;
    replaceAll({ results, replace: replaceTerm });
    this.setState({
      results: [],
      replaceTerm: '',
      searchComplete: false,
    });
  }

  render() {
    const { searchTerm, replaceTerm, results, searchComplete } = this.state;
    const { searching } = this.props;
    if (!searching) {
      return null;
    }

    return (
      <SearchWrap>
        <div>
          <i
            className="close fas fa-times-circle"
            onClick={this.cancelSearch}
          />
          <SearchControls
            searchTerm={searchTerm}
            changeSearchTerm={this.changeSearchTerm}
            changeReplaceTerm={this.changeReplaceTerm}
            search={this.search}
            replaceAll={this.replaceAll}
          />
          {searchComplete && <SearchSummary results={results} />}
        </div>
        <Results>
          {results.map((r, i) => (
            <SearchResult
              key={`${r.filename}-${i}`}
              replace={replaceTerm}
              result={r}
              number={i + 1}
              dismiss={() => this.dismissResult(i)}
            />
          ))}
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
  replaceAll: actions.replaceAll,
  cancelSearch: actions.cancelSearch,
  update: actions.updateSearch,
};

export default connect(mapState, mapDispatch)(Search);
