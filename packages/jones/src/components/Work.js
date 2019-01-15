// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import type { Task, Friend, Dispatch } from '../type';
import { currentTask } from '../select';
import * as actions from '../actions';
// import KeyCommand from './KeyCommand';
import Editor from './Editor';
import Sidebar from './Sidebar';
import Search from './Search';
import Loading from './Loading';

const Main = styled.div`
  display: flex;
  ${'' /* height: calc(100vh - 35px); */}
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
  height: calc(100vh - 35px);
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

  async componentDidMount() {
    const { task, checkout } = this.props;
    if (!task.baseCommit) {
      checkout(task);
    }
  }

  render() {
    const { task } = this.props;
    // const { increaseFontSize, decreaseFontSize, saveEdited } = this.props;
    if (!task.baseCommit) {
      return <Loading />;
    }

    return (
      <Wrap>
        {/* <WorkNav /> */}
        <Main>
          <Sidebar />
          <EditorPane>
            <Editor />
            <Search />
          </EditorPane>
        </Main>
        {/* <KeyCommand
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
        /> */}
      </Wrap>
    );
  }
}

const mapState = state => ({
  task: currentTask(state),
});

const mapDispatch = {
  checkout: actions.checkout,
  // saveEdited: actions.saveCurrentTaskEditedFiles,
  // increaseFontSize: actions.increaseEditorFontSize,
  // decreaseFontSize: actions.decreaseEditorFontSize,
};

export default connect(mapState, mapDispatch)(Work);
