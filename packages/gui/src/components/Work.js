// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { ipcRenderer, callMain } from '../webpack-electron';
import type { Task, Friend, Dispatch } from '../redux/type';
import { currentTaskFriend } from '../redux/select';
import * as actions from '../redux/actions';
import Editor from './Editor';
import Button from './Button';
import Sidebar from './Sidebar';
import Search from './Search';

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
`;

const EditorPane = styled.div`
  flex: auto;
  display: flex;
  height: calc(100vh - 35px);
  flex-flow: column nowrap;
`;

type Props = {|
  task: Task,
  friend: Friend,
  receiveRepoFiles: Dispatch,
  toTasks: Dispatch,
|};

type State = {|
  branch: string,
|};

class Work extends React.Component<Props, State> {
  state = {
    branch: '',
  }

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
    const { friend, task, toTasks } = this.props;
    if (!branch) {
      return <p>Hang on there one sec...</p>;
    }
    return (
      <Wrap>
        <Nav>
          <Button className="tasks" secondary onClick={toTasks}>&larr; Tasks</Button>
          <span className="task-friend">{friend.name}:&nbsp;</span>
          <span className="task-name"><i>{task.name}</i></span>
        </Nav>
        <Main>
          <Sidebar friend={friend} />
          <EditorPane>
            <Editor />
            <Search />
          </EditorPane>
        </Main>
      </Wrap>
    );
  }
}

const mapState = state => currentTaskFriend(state);

const mapDispatch = dispatch => ({
  toTasks: () => dispatch(actions.changeScreen('TASKS')),
  receiveRepoFiles: (...args) => dispatch(actions.receiveRepoFiles(...args)),
});

export default connect(mapState, mapDispatch)(Work);
