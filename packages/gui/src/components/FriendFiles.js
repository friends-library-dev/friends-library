// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Friend } from '../redux/type';
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
    list-style: none;
  }
`;

const EditionLi = styled.li`
  margin-top: 0.5em;
  & > span {
    text-transform: capitalize;
    margin-left: 0.5em;
  }
  & > ul {
    margin: 0.35em 0 0.75em;
  }
`;

type Props = {|
  friend: Friend,
  selectFile: (any) => *,
|};

const FriendFiles = ({ friend, selectFile }: Props) => {
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
                  {values(edition.files).map(file => (
                    <li key={file.filename} onClick={() => selectFile({
                      lang: 'en',
                      friend: friend.slug,
                      document: document.slug,
                      edition: edition.type,
                      filename: file.filename,
                    })}>
                      <code>{file.filename}</code>
                    </li>
                  ))}
                </ul>
              </EditionLi>
            ))}
          </ul>
        </li>
      ))}
    </Wrap>
  )
}

const mapDispatch = {
  selectFile: actions.setEditingFile,
};

export default connect(null, mapDispatch)(FriendFiles);
