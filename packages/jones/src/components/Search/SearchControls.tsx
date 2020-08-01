import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch, State as AppState } from '../../type';
import styled from '@emotion/styled/macro';
import debounce from 'lodash/debounce';
import Button from '../Button';
import * as actions from '../../actions';

const Modifiers = styled.div`
  color: #555;
  font-size: 13px;

  label {
    margin-right: 0.9em;
    position: relative;
    display: inline-block;
    line-height: 29px;
    vertical-align: middle;
    padding-left: 20px;
  }

  input {
    appearance: none;
    background: #222;
    margin-right: 0.35em;
    width: 12px;
    height: 12px;
    position: absolute !important;
    bottom: 5px;
    left: 1px;
    border-radius: 2px;
    display: inline-block;
    position: relative;
  }

  input:focus {
    outline: 0;
  }

  input:checked {
    opacity: 0.6;
    background: var(--accent);
  }
`;

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

interface Props {
  searchTerm: string;
  undo: Dispatch;
  redo: Dispatch;
  cancelSearch: Dispatch;
  toggleCaseSensitive: Dispatch;
  toggleRegexp: Dispatch;
  toggleWords: Dispatch;
  caseSensitive: boolean;
  words: boolean;
  regexp: boolean;
  changeSearchTerm: (term: string) => void;
  changeReplaceTerm: (term: string) => void;
  search: () => void;
  replaceAll: () => void;
}

interface State {
  replaceTerm: string;
}

class Component extends React.Component<Props, State> {
  private searchInput = React.createRef<HTMLInputElement>();

  public state = {
    replaceTerm: ``,
  };

  public componentDidMount(): void {
    if (this.searchInput.current) {
      this.searchInput.current.focus();
    }
  }

  protected changeReplaceTerm = debounce(() => {
    const { replaceTerm } = this.state;
    const { changeReplaceTerm } = this.props;
    changeReplaceTerm(replaceTerm);
  }, 500);

  protected handleReplaceTermChange: (e: React.ChangeEvent<HTMLInputElement>) => void = (
    e,
  ) => {
    this.setState({ replaceTerm: e.target.value }, this.changeReplaceTerm);
  };

  protected replaceAll: () => void = () => {
    this.setState({ replaceTerm: `` });
    this.props.replaceAll();
  };

  protected handleSpecialKeys: (event: React.KeyboardEvent<HTMLInputElement>) => void = (
    event,
  ) => {
    const { undo, redo, cancelSearch } = this.props;
    if (event.key === `z` && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      event.shiftKey ? redo() : undo();
    }

    if (event.key === `Escape`) {
      cancelSearch();
    }

    if (event.key === `f` && (event.ctrlKey || event.metaKey)) {
      event.preventDefault();
      cancelSearch();
    }
  };

  public render(): JSX.Element {
    const { replaceTerm } = this.state;
    const {
      searchTerm,
      changeSearchTerm,
      search,
      toggleCaseSensitive,
      toggleWords,
      toggleRegexp,
      regexp,
      words,
      caseSensitive,
    } = this.props;

    return (
      <div>
        <Modifiers>
          <label>
            <input type="checkbox" checked={words} onChange={() => toggleWords()} />
            whole words
          </label>
          <label>
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={() => toggleCaseSensitive()}
            />
            case sensitive
          </label>
          <label>
            <input type="checkbox" checked={regexp} onChange={() => toggleRegexp()} />
            regexp
          </label>
        </Modifiers>
        <SearchBar>
          <input
            ref={this.searchInput}
            value={searchTerm}
            placeholder="Find"
            onChange={(e) => changeSearchTerm(e.target.value)}
            onKeyDown={(event) => {
              this.handleSpecialKeys(event);
              if (event.key === `Enter`) {
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
    );
  }
}

const mapState = (
  state: AppState,
): Pick<Props, 'words' | 'regexp' | 'caseSensitive'> => ({
  words: state.search.words,
  regexp: state.search.regexp,
  caseSensitive: state.search.caseSensitive,
});

const mapDispatch = {
  toggleWords: actions.toggleSearchWords,
  toggleCaseSensitive: actions.toggleSearchCaseSensitive,
  toggleRegexp: actions.toggleSearchRegexp,
  cancelSearch: actions.cancelSearch,
  undo: actions.undoTasks,
  redo: actions.redoTasks,
};

export default connect(mapState, mapDispatch)(Component);
