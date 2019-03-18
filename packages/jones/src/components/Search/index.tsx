import * as React from 'react';
import styled from '@emotion/styled/macro';
import { connect } from 'react-redux';
import KeyEvent from 'react-keyboard-event-handler';
import {
  Dispatch,
  File,
  SearchResult as SearchResultType,
  State as AppState,
} from '../../type';
import * as actions from '../../actions';
import { searchedFiles } from '../../select';
import { searchFiles } from '../../lib/search';
import SearchResult from './SearchResult';
import SearchControls from './SearchControls';
import SearchSummary from './SearchSummary';
import SearchScope from './SearchScope';

const SearchWrap = styled.div`
  display: flex;
  flex-direction: column;
  background: #000;
  padding: 0.75em 0 0 1.5em;
  height: 70vh;
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

let keepSearchTerm = '';

function initialState() {
  return {
    searchComplete: false,
    searchTerm: keepSearchTerm,
    replaceTerm: '',
    results: [] as SearchResultType[],
  };
}

type Props = {
  files: File[];
  searching: boolean;
  regexp: boolean;
  words: boolean;
  caseSensitive: boolean;
  cancelSearch: Dispatch;
  replaceAll: Dispatch;
};

type State = {
  searchTerm: string;
  replaceTerm: string;
  results: SearchResultType[];
  searchComplete: boolean;
};

class Search extends React.Component<Props, State> {
  state = initialState();

  componentDidUpdate(prev: Props) {
    const { files, regexp, words, caseSensitive } = this.props;
    if (files.length !== prev.files.length) {
      this.setState(initialState());
      return;
    }
    if (
      regexp !== prev.regexp ||
      words !== prev.words ||
      caseSensitive !== prev.caseSensitive
    ) {
      this.setState(
        { results: [] as SearchResultType[], searchComplete: false },
        this.search,
      );
    }
  }

  changeSearchTerm = (searchTerm: string) => {
    keepSearchTerm = searchTerm;
    this.setState({
      searchTerm,
      searchComplete: false,
      results: [] as SearchResultType[],
    });
  };

  changeReplaceTerm = (replaceTerm: string) => {
    this.setState({
      replaceTerm,
    });
  };

  search = () => {
    const { searchTerm } = this.state;
    const { files, regexp, caseSensitive, words } = this.props;
    const termLength = searchTerm.trim().length;
    if (termLength < 3) {
      return;
    }

    if (regexp && termLength < 5) {
      return;
    }

    const results = searchFiles(searchTerm, files, words, caseSensitive, regexp);
    this.setState({ results, searchComplete: true });
  };

  cancelSearch = () => {
    const { cancelSearch } = this.props;
    cancelSearch();
    this.setState({ searchTerm: '', results: [] });
  };

  dismissResult(index: number) {
    const { results } = this.state;
    results[index].dismissed = true;
    this.setState({ results });
  }

  replaceAll = () => {
    const { replaceAll } = this.props;
    const { results, replaceTerm } = this.state;
    replaceAll({ results, replace: replaceTerm });
    this.setState({
      results: [] as SearchResultType[],
      replaceTerm: '',
      searchComplete: false,
    });
  };

  render() {
    const { searchTerm, replaceTerm, results, searchComplete } = this.state;
    const { searching } = this.props;
    if (!searching) {
      return null;
    }

    return (
      <SearchWrap>
        <div>
          <i className="close fas fa-times-circle" onClick={this.cancelSearch} />
          <SearchControls
            searchTerm={searchTerm}
            changeSearchTerm={this.changeSearchTerm}
            changeReplaceTerm={this.changeReplaceTerm}
            search={this.search}
            replaceAll={this.replaceAll}
          />
          <SearchScope />
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
        <KeyEvent handleKeys={['esc']} onKeyEvent={this.cancelSearch} />
      </SearchWrap>
    );
  }
}

const mapState = (state: AppState) => {
  const {
    search: { searching, regexp, caseSensitive, words },
  } = state;
  return {
    files: searchedFiles(state),
    searching,
    regexp,
    caseSensitive,
    words,
  };
};

const mapDispatch = {
  replaceAll: actions.replaceAll,
  cancelSearch: actions.cancelSearch,
};

export default connect(
  mapState,
  mapDispatch,
)(Search);
