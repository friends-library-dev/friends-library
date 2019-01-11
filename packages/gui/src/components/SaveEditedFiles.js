// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Asciidoc, Slug, Uuid } from '../../../../type';
import type { Dispatch } from '../redux/type';
import Button from './Button';
import KeyCommand from './KeyCommand';
import { ipcRenderer as ipc } from '../webpack-electron';
import * as actions from '../redux/actions';
import { friendIterator, currentTaskFriend } from '../redux/select';

const Save = styled(Button)`
  opacity: ${({ enabled }) => (enabled ? 1 : 0.4)};
  cursor: ${({ enabled }) => (enabled ? 'pointer' : 'not-allowed')};
  background: ${({ enabled }) => (enabled ? 'var(--accent)' : '#666')};

  & i {
    padding-right: 0.5em;
  }

  & .badge {
    margin-left: 0.5em;
    color: white;
    background: orange;
    border-radius: 50%;
    font-weight: bold;
    width: 15px;
    height: 15px;
    padding: 0 7px;
  }
`;

type Props = {|
  editedFiles: Array<{|
    path: string,
    editedContent: Asciidoc,
  |}>,
  taskId: Uuid,
  saveFiles: Dispatch,
  touchTask: Dispatch,
  friendSlug: Slug,
|};

class SaveEditedFiles extends React.Component<Props> {
  save() {
    const { editedFiles, friendSlug, touchTask, taskId, saveFiles } = this.props;
    if (editedFiles.length > 0) {
      ipc.send('save:files', editedFiles);
      ipc.send('commit:wip', friendSlug);
      touchTask(taskId);
      saveFiles(friendSlug);
    }
  }

  render() {
    const { editedFiles } = this.props;
    return (
      <Save
        height={35}
        enabled={editedFiles.length > 0}
        onClick={() => this.save()}
      >
        <i className="fas fa-save" />
        Save
        {editedFiles.length > 1 && (
          <span className="badge">
            <b>{editedFiles.length}</b>
          </span>
        )}
        <KeyCommand
          keys={['Cmd+S']}
          handle={() => this.save()}
        />
      </Save>
    );
  }
}

const mapState = state => {
  const { friend, task } = currentTaskFriend(state);
  const editedFiles = [];
  friendIterator(friend, {
    file: ({ diskContent, editedContent, path }) => {
      if (diskContent !== editedContent) {
        editedFiles.push({
          path,
          editedContent,
        });
      }
    },
  });

  return {
    editedFiles,
    taskId: task.id,
    friendSlug: friend.slug,
  };
};

const mapDispatch = {
  saveFiles: actions.saveFiles,
  touchTask: actions.touchTask,
};

export default connect(mapState, mapDispatch)(SaveEditedFiles);
