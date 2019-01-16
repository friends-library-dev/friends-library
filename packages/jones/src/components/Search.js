// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import * as actions from '../actions';
import { searchFiles } from '../lib/search';
import Button from './Button';
import SearchResult from './SearchResult';

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  background: #000;
  padding: 1.5em;
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
  margin-right: -1.5em;
  margin-bottom: -1.5em;
`;

const SearchBar = styled.div`
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

class Search extends React.Component<*, *> {
  state = {
    string: '',
    results: [],
  }

  handleChange = (e) => {
    this.setState({ string: e.target.value });
  }

  search = () => {
    const { string } = this.state;
    const { update, files, regexp, caseSensitive } = this.props;
    if (string.trim()) {
      update({ string });
      const results = searchFiles(string, files, regexp, caseSensitive);
      this.setState({ results });
    }
  }

  render() {
    const { string, results } = this.state;
    const { update, searching } = this.props;

    // temp
    if (process.env.NODE_ENV !== 'development' && searching) {
      return (
        <Wrap>
          <i
            className="close fas fa-times-circle"
            onClick={() => update({ searching: false })}
          />
          <p style={{ textAlign: 'center', marginTop: '20vh' }}>
            <span style={{ fontSize: '1.4em' }}>Sorry, I'm not done with this feature!</span><br /><br /><br />
            <span style={{ fontSize: 30 }}>༼ つ ◕_◕ ༽つ</span><br /><br />
            For now, you can only search <i>within</i> a file by using
            {' '}<code>Cmd+F</code> or <code>Ctrl+F</code>.<br />
            Soon, this screen will allow you to search <i>groups of files.</i>
          </p>
        </Wrap>
      );
    }

    if (!searching) {
      return null;
    }

    return (
      <Wrap>
        <div>
          <SearchBar>
            <i
              className="close fas fa-times-circle"
              onClick={() => update({ searching: false })}
            />
            <input value={string} onChange={this.handleChange} />
            <Button secondary onClick={this.search} height={35}>
              Search!
            </Button>
          </SearchBar>
          <p>Found <code>{results.length}</code> result{results.length === 1 ? '' : 's'}:</p>
        </div>
        <Results>
          {results.map(r => <SearchResult result={r} key={r.filename} />)}
        </Results>
      </Wrap>
    );
  }
}

const mapState = state => {
  const { search: { searching } } = state;
  return {
    files: [],//files,
    searching,
    regexp: false,
    caseSensitive: false,
  };
};

const mapDispatch = {
  update: actions.updateSearch,
};

export default connect(mapState, mapDispatch)(Search);
