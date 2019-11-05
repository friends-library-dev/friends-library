import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled/macro';
import { searchedFiles, currentTaskFriendName, requireCurrentTask } from '../../select';
import { State } from '../../type';
import { EditionType } from '@friends-library/types';

const SearchScope = styled.div`
  color: #666;
  font-size: 14px;
  margin: 10px 0 25px 0;
  opacity: 0.9;

  i {
    border-bottom: 1px dotted #333;
  }

  i.edition {
    text-transform: capitalize;
  }

  code {
    color: var(--accent);
    opacity: 0.6;
    font-size: 13.5px;
  }
`;

interface Props {
  documentTitle?: string;
  editionType: EditionType | undefined;
  filename?: string;
  numFiles?: number;
  numBooks?: number;
  friendName?: string;
}

class Component extends React.Component<Props> {
  protected renderSingleFile(): JSX.Element {
    const { filename } = this.props;
    return (
      <>
        * Searching only in the <i>current active</i> file: <code>{filename}</code>
      </>
    );
  }

  protected renderEdition(): JSX.Element {
    const { editionType, documentTitle, numFiles } = this.props;
    return (
      <>
        * Searching <code>{numFiles}</code> files in the{' '}
        <i className="edition">{editionType}</i> edition of <i>{documentTitle}</i>.
      </>
    );
  }

  protected renderDocument(): JSX.Element {
    const { documentTitle, numFiles } = this.props;
    return (
      <>
        * Searching all <code>{numFiles}</code> files in: <i>{documentTitle}</i>.
      </>
    );
  }

  protected renderFriend(): JSX.Element {
    const { friendName } = this.props;
    return (
      <>
        * Searching <i>all books</i> by: <i>{friendName}</i>.
      </>
    );
  }

  public render(): JSX.Element {
    const { filename, editionType, documentTitle } = this.props;
    let inner;
    if (filename) {
      inner = this.renderSingleFile();
    } else if (editionType) {
      inner = this.renderEdition();
    } else if (documentTitle) {
      inner = this.renderDocument();
    } else {
      inner = this.renderFriend();
    }
    return <SearchScope>{inner}</SearchScope>;
  }
}

const mapState = (state: State): Props => {
  const task = requireCurrentTask(state);
  const { filename, documentSlug, editionType } = state.search;

  return {
    filename,
    numFiles: searchedFiles(state).length,
    documentTitle: documentSlug ? task.documentTitles[documentSlug] : undefined,
    editionType: editionType === undefined ? undefined : editionType,
    friendName: currentTaskFriendName(state),
  };
};

export default connect(mapState)(Component);
