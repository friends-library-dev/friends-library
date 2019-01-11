// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import { ipcRenderer, callMain } from '../webpack-electron';
import type { Task, Friend, Dispatch } from '../redux/type';
import { currentTaskFriend } from '../redux/select';
import * as actions from '../redux/actions';
import KeyCommand from './KeyCommand';
import Editor from './Editor';
import Sidebar from './Sidebar';
import Search from './Search';
import WorkNav from './WorkNav';

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
  saveEdited: Dispatch,
  increaseFontSize: Dispatch,
  decreaseFontSize: Dispatch,
|};

type State = {|
  branch: string,
|};

class Work extends React.Component<Props, State> {
  state = {
    branch: '',
  }

  async componentDidMount() {
    const { friend, task } = this.props;
    if (!friend.filesReceived) {
      ipcRenderer.send('request:files', friend.slug);
    }

    const branch = await callMain('ensure:branch', task);
    this.setState({ branch });
  }

  render() {
    const { branch } = this.state;
    const { friend, increaseFontSize, decreaseFontSize, saveEdited } = this.props;
    if (!branch) {
      return <p>Hang on there one sec...</p>;
    }
    return (
      <Wrap>
        <WorkNav />
        <Main>
          <Sidebar friend={friend} />
          <EditorPane>
            <Editor />
            <Search />
          </EditorPane>
        </Main>
        <KeyCommand
          keys={['Cmd+S']}
          handle={saveEdited}
        />
        <KeyCommand
          keys={['Cmd+Up']}
          handle={increaseFontSize}
        />
        <KeyCommand
          keys={['Cmd+Down']}
          handle={decreaseFontSize}
        />
      </Wrap>
    );
  }
}

const mapState = state => currentTaskFriend(state);

const mapDispatch = {
  saveEdited: actions.saveCurrentTaskEditedFiles,
  increaseFontSize: actions.increaseEditorFontSize,
  decreaseFontSize: actions.decreaseEditorFontSize,
};

export default connect(mapState, mapDispatch)(Work);
