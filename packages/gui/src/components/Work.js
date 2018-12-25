// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { ipcRenderer } from '../webpack-electron';
import type { Task, Friend, Dispatch } from '../redux/type';
import * as actions from '../redux/actions';
import FriendFiles from './FriendFiles';
import Editor from './Editor';


const Wrap = styled.div`
  display: flex;
  height: calc(100vh - 30px);
  margin: -1em -2em;
`;

const Sidebar = styled.div`
  background: #333;
  flex: 1 0 0;
  overflow: auto;
`;

const EditorPane = styled.div`
  flex: 2 0 0;
`;

type Props = {|
  task: Task,
  friend: Friend,
  receiveRepoFiles: Dispatch,
|};

class Work extends React.Component<Props> {

  componentDidMount() {
    const { receiveRepoFiles, friend } = this.props;
    if (!friend.filesReceived) {
      ipcRenderer.send('request:files', friend.slug);
    }

    ipcRenderer.on('RECEIVE_REPO_FILES', (_, friendSlug, files) => {
      receiveRepoFiles({ friendSlug, files });
    });
  }

  render() {
    const { friend } = this.props;
    return (
      <Wrap>
        <Sidebar>
          <FriendFiles friend={friend} />
        </Sidebar>
        <EditorPane>
          <Editor />
        </EditorPane>
      </Wrap>
    );
  }
};

const mapState = state => {
  const task = state.tasks[state.currentTask];
  return {
    friend: state.friends[`en/${task.repo}`],
    task,
  };
};

const mapDispatch = {
  receiveRepoFiles: actions.receiveRepoFiles,
};

export default connect(mapState, mapDispatch)(Work);
