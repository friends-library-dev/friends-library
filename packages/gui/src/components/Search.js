// @flow
import * as React from 'react';
import styled from '@emotion/styled';
import { connect } from 'react-redux';
import * as actions from '../redux/actions';
import { currentTaskFriend, friendIterator } from '../redux/select';
import Button from './Button';
import { searchFiles } from '../lib/search';

const Wrap = styled.div`
  background: #000;
  height: 65vh;
  flex: 0 0 auto;
  color: white;
  position: relative;

  & .close {
    position: absolute;
    top: 5px;
    right: 5px;
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
    const { update, searching, filesLoaded } = this.props;

    // temp
    if (process.env.NODE_ENV !== 'development') {
      return (
        <Wrap sytle={{ display: 'flex' }}>
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

    if (!filesLoaded) {
      return (
        <Wrap><p>Loading files...</p></Wrap>
      );
    }

    return (
      <Wrap>
        <i
          className="close fas fa-times-circle"
          onClick={() => update({ searching: false })}
        />
        <input value={string} onChange={this.handleChange} />
        <Button secondary onClick={this.search}>
          Search!
        </Button>
        <pre>
          {JSON.stringify(results, null, 2)}
        </pre>
      </Wrap>
    );
  }
}

const mapState = state => {
  const { friend } = currentTaskFriend(state);
  const { search } = state;
  const { searching, documentSlug, editionType } = search;
  const files = [];
  friendIterator(friend, {
    file: (file, ed, doc) => {
      if (documentSlug && documentSlug !== doc.slug) {
        return;
      }
      if (editionType && editionType !== ed.type) {
        return;
      }
      files.push(file);
    },
  });
  return {
    files,
    searching,
    regexp: search.regexp,
    caseSensitive: search.caseSensitive,
    filesLoaded: !!files.find(f => f.diskContent),
  };
};

const mapDispatch = {
  update: actions.updateSearch,
};

export default connect(mapState, mapDispatch)(Search);
