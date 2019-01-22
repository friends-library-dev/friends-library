// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from '../../type';
import styled from '@emotion/styled/macro';
import debounce from 'lodash/debounce';
import Button from '../Button';
import * as actions from '../../actions';

const SearchBar = styled.div`
  padding-right: 1.5em;
  display: flex;
  flex-direction: row;
  margin: 5px 0;

  & input {
    flex-grow: 1;
    background: #333;
    color: #dedede;
    padding: 2px 10px;
    font-size: 16px;
    font-family: monospace;
    border: none;
  }

  .Button {
    margin-left: 5px;
    margin-right: -19px;
    color: #bbb;
    width: 140px;
    text-align: left;
    padding-left: 1em;
  }

  .fas {
    opacity: 0.45;
    padding-right: 0.25em;
  }
`;

type Props = {|
  searchTerm: string,
  undo: Dispatch,
  redo: Dispatch,
  cancelSearch: Dispatch,
  changeSearchTerm: (string) => void,
  changeReplaceTerm: (string) => void,
  search: () => void,
  replaceAll: () => void,
|};

type State = {|
  replaceTerm: string,
|};

class Component extends React.Component<Props, State> {
  searchInput: *

  state = {
    replaceTerm: ''
  }

  constructor(props: Props) {
    super(props);
    this.searchInput = React.createRef();
  }

  componentDidMount() {
    if (this.searchInput.current) {
      this.searchInput.current.focus();
    }
  }

  changeReplaceTerm = debounce(() => {
    const { replaceTerm } = this.state;
    const { changeReplaceTerm } = this.props;
    changeReplaceTerm(replaceTerm);
  }, 500);

  handleReplaceTermChange = (e: *) => {
    this.setState(
      { replaceTerm: e.target.value },
      this.changeReplaceTerm,
    );
  }

  replaceAll = () => {
    this.setState({ replaceTerm: '' });
    this.props.replaceAll();
  }

  handleSpecialKeys = event => {
    const { undo, redo, cancelSearch } = this.props;
    if (event.key === 'z' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
    }

    if (event.key === 'Escape') {
      cancelSearch();
    }

    if (event.key === 'f' && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      cancelSearch();
    }
  }

  render() {
    const { replaceTerm, } = this.state;
    const { searchTerm, changeSearchTerm, search } = this.props;
    return (
      <div>
        <SearchBar>
          <input
            ref={this.searchInput}
            value={searchTerm}
            placeholder="Find"
            onChange={(e) => changeSearchTerm(e.target.value)}
            onKeyDown={event => {
              this.handleSpecialKeys(event);
              if (event.key === 'Enter') {
                search();
              }
            }}
          />
          <Button className="Button" secondary onClick={search} height={35}>
            <i className="fas fa-search" />
            &nbsp;Find
          </Button>
        </SearchBar>
        <SearchBar>
          <input
            value={replaceTerm}
            placeholder="Replace"
            onChange={this.handleReplaceTermChange}
            onKeyDown={this.handleSpecialKeys}
          />
          <Button className="Button" secondary onClick={this.replaceAll} height={35}>
            <i className="fas fa-sync" />
            &nbsp;Replace All
          </Button>
        </SearchBar>
      </div>
    )
  }
}

const mapDispatch = {
  cancelSearch: actions.cancelSearch,
  undo: actions.undoTasks,
  redo: actions.redoTasks,
}

export default connect(null, mapDispatch)(Component);
