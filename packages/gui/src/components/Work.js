// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { ipcRenderer, callMain } from '../webpack-electron';
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

type State = {|
  branch?: string,
|};

class Work extends React.Component<Props, State> {

  state = {}

  async componentDidMount() {
    const { receiveRepoFiles, friend, task } = this.props;
    if (!friend.filesReceived) {
      ipcRenderer.send('request:files', friend.slug);
    }

    ipcRenderer.on('RECEIVE_REPO_FILES', (_, friendSlug, files) => {
      receiveRepoFiles({ friendSlug, files });
    });

    const branch = await callMain('ensure:branch', task);
    this.setState({ branch });
  }

  render() {
    const { branch } = this.state;
    const { friend } = this.props;
    if (!branch) {
      return <p>Hang on there one sec...</p>;
    }
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
