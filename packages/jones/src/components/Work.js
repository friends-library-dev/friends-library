// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import KeyEvent from 'react-keyboard-event-handler';
import type { Task, Friend, Dispatch } from '../type';
import { currentTask } from '../select';
import * as actions from '../actions';
import Editor from './Editor';
import Sidebar from './Sidebar';
import Search from './Search';
import Loading from './Loading';

const Main = styled.div`
  display: flex;
  height: 100%;
`;

const Wrap = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const EditorPane = styled.div`
  flex: auto;
  display: flex;
  height: calc(100vh - 50px);
  flex-flow: column nowrap;
  justify-content: flex-end;
`;

type Props = {|
  task: Task,
  friend: Friend,
  saveEdited: Dispatch,
  increaseFontSize: Dispatch,
  decreaseFontSize: Dispatch,
|};


class Work extends React.Component<Props> {

  componentDidMount() {
    const { task, checkout } = this.props;
    if (!task.parentCommit) {
      checkout({...task});
    }
  }

  render() {
    const { task } = this.props;
    const { increaseFontSize, decreaseFontSize } = this.props;
    if (!task.parentCommit) {
      return <Loading />;
    }

    return (
      <Wrap>
        <Main>
          <Sidebar />
          <EditorPane>
            <Editor />
            <Search />
          </EditorPane>
        </Main>
        <KeyEvent
          handleKeys={['meta+Up', 'ctrl+Up']}
          onKeyEvent={increaseFontSize}
        />
        <KeyEvent
          handleKeys={['meta+Down', 'ctrl+Down']}
          onKeyEvent={decreaseFontSize}
        />
      </Wrap>
    );
  }
}

const mapState = state => ({
  task: currentTask(state),
});

const mapDispatch = {
  checkout: actions.checkout,
  increaseFontSize: actions.increaseEditorFontSize,
  decreaseFontSize: actions.decreaseEditorFontSize,
};

export default connect(mapState, mapDispatch)(Work);
