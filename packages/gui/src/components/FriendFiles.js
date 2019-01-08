// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { isEqual } from 'lodash';
import styled from '@emotion/styled';
import type { Friend, EditingFile, Dispatch } from '../redux/type';
import { values } from './utils';
import * as actions from '../redux/actions';

const Loading = styled.h1`
  text-align: center;
  line-height: calc(100vh - 30px);
  opacity: 0.3;
`;

const Wrap = styled.ul`
  margin: 0;
  padding: 1.5em;

  > li > .fa-book {
    padding-right: 0.3em;
  }

  & li {
    white-space: nowrap;
    list-style: none;
  }
`;

const EditionLi = styled.li`
  margin-top: 0.5em;
  white-space: nowrap;
  & > span {
    text-transform: capitalize;
    margin-left: 0.5em;
  }
  & > ul {
    margin: 0.35em 0 0.75em;
    padding-left: 1.5em;
  }
`;

const Filename = styled.li`
  margin: 5px;

  & code {
    font-size: 13px;
    cursor: pointer;
    padding: 2px 8px;
    background: #232323;
    &:hover {
      background: #000;
    }
  }
  &.editing {
    & code {
      color: #000;
      cursor: default;
      background: var(--accent);
    }
  }
`;

type Props = {|
  friend: Friend,
  editingFile: EditingFile,
  selectFile: Dispatch,
|};

const FriendFiles = ({ friend, selectFile, editingFile }: Props) => {
  if (!friend.filesReceived) {
    return (<Loading>Loading...</Loading>);
  }
  return (
    <Wrap>
      {values(friend.documents).map(document => (
        <li key={document.slug}>
          <i className="fas fa-book" /> {document.title}
          <ul>
            {values(document.editions).map(edition => (
              <EditionLi key={edition.type}>
                <i className="far fa-bookmark" />
                <span className="edition-type">{edition.type}</span> edition:
                <ul>
                  {values(edition.files).map(({ filename }) => {
                    const file = {
                      lang: 'en',
                      friend: friend.slug,
                      document: document.slug,
                      edition: edition.type,
                      filename,
                    };
                    const editing = isEqual(file, editingFile);
                    return (
                      <Filename
                        key={filename}
                        onClick={() => selectFile(file)}
                        className={editing ? 'editing' : ''}
                      >
                        <code>{filename}</code>
                      </Filename>
                    );
                  })}
                </ul>
              </EditionLi>
            ))}
          </ul>
        </li>
      ))}
    </Wrap>
  );
};

const mapState = state => ({
  editingFile: state.editingFile,
});

const mapDispatch = {
  selectFile: actions.setEditingFile,
};

export default connect(mapState, mapDispatch)(FriendFiles);
