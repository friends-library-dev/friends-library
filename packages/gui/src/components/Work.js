// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { ipcRenderer, callMain } from '../webpack-electron';
import type { Task, Friend, Dispatch } from '../redux/type';
import * as actions from '../redux/actions';
import FriendFiles from './FriendFiles';
import Editor from './Editor';
import Button from './Button';

const Nav = styled.nav`
  height: 35px;
  background: black;

  & .tasks {
    height: 35px;
    line-height: 35px;
  }
`;

const Main = styled.div`
  display: flex;
  height: calc(100vh - 35px);
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
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
  toTasks: Dispatch,
|};

type State = {|
  branch?: string,
|};

class Work extends React.Component<Props, State> {

  state = {}

  async componentDidMount() {
    const { receiveRepoFiles, friend, task } = this.props;
    if (!friend.filesReceived) {
      console.log('request files!', friend.slug);
      ipcRenderer.send('request:files', friend.slug);
    }

    ipcRenderer.on('RECEIVE_REPO_FILES', (_, friendSlug, files) => {
      console.log('receive files!', friendSlug);
      receiveRepoFiles({ friendSlug, files });
    });

    const branch = await callMain('ensure:branch', task);
    this.setState({ branch });
  }

  render() {
    const { branch } = this.state;
    const { friend, task, toTasks } = this.props;
    if (!branch) {
      return <p>Hang on there one sec...</p>;
    }
    return (
      <Wrap>
        <Nav>
          <Button className="tasks" secondary={true} onClick={toTasks}>&larr; Tasks</Button>
          <span className="task-friend">{friend.name}:&nbsp;</span>
          <span className="task-name"><i>{task.name}</i></span>
        </Nav>
        <Main>
          <Sidebar>
            <FriendFiles friend={friend} />
          </Sidebar>
          <EditorPane>
            <Editor />
          </EditorPane>
        </Main>
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

const mapDispatch = dispatch => ({
  toTasks: () => dispatch(actions.changeScreen('TASKS')),
  receiveRepoFiles: (...args) => dispatch(actions.receiveRepoFiles(...args)),
});

export default connect(mapState, mapDispatch)(Work);
