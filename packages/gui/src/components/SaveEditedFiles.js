// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Asciidoc, Slug, Uuid } from '../../../../type';
import type { Dispatch } from '../redux/type';
import Button from './Button';
import { ipcRenderer as ipc } from '../webpack-electron';
import * as actions from '../redux/actions';
import { friendIterator, currentTaskFriend } from '../redux/select';

const Save = styled(Button)`
  position: fixed;
  top: 0;
  right: 0;
  height: 35px;
  line-height: 35px;
  margin-right: 0;
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

const SaveEditedFiles = ({
  editedFiles,
  saveFiles,
  friendSlug,
  touchTask,
  taskId,
}: Props) => (
  <Save
    enabled={editedFiles.length > 0}
    onClick={() => {
      ipc.send('save:files', editedFiles);
      ipc.send('commit:wip', friendSlug);
      touchTask(taskId);
      saveFiles(friendSlug);
    }}
  >
    <i className="fas fa-save" />
    Save
    {editedFiles.length > 1 && (
      <span className="badge">
        <b>{editedFiles.length}</b>
      </span>
    )}
  </Save>
);

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
