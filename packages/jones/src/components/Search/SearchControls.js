// @flow
import * as React from 'react';
import styled from '@emotion/styled/macro';
import debounce from 'lodash/debounce';
import Button from '../Button';

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

  render() {
    const { replaceTerm } = this.state;
    const { searchTerm, changeSearchTerm, search } = this.props;
    return (
      <div>
        <SearchBar>
          <input
            ref={this.searchInput}
            value={searchTerm}
            placeholder="Find"
            onChange={(e) => changeSearchTerm(e.target.value)}
            onKeyPress={event => {
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

export default Component;
