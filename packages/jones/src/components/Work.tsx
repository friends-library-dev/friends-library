import * as React from 'react';
import { connect } from 'react-redux';
import get from 'lodash/get';
import styled from '@emotion/styled/macro';
import KeyEvent from 'react-keyboard-event-handler';
import { Task, Dispatch, State as AppState } from '../type';
import { requireCurrentTask } from '../select';
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

type Props = {
  task: Task;
  checkout: Dispatch;
  undo: Dispatch;
  redo: Dispatch;
  find: Dispatch;
  increaseFontSize: Dispatch;
  decreaseFontSize: Dispatch;
  toggleSidebarOpen: Dispatch;
  syncTask: Dispatch;
};

class Work extends React.Component<Props> {
  private statusInterval: any = -1;

  componentDidMount() {
    const { task, checkout, syncTask } = this.props;
    if (!task.parentCommit) {
      checkout(task);
    }
    if (task.pullRequest) {
      this.statusInterval = setInterval(() => syncTask(task), 1000 * 60 * 2);
    }
  }

  componentWillUnmount() {
    clearInterval(this.statusInterval);
  }

  render() {
    const { task } = this.props;
    const {
      increaseFontSize,
      decreaseFontSize,
      toggleSidebarOpen,
      undo,
      redo,
      find,
    } = this.props;
    const status = get(task, 'pullRequest.status', 'open');
    if (status !== 'open') {
      return (
        <div style={{ color: 'red', padding: '1em 3em' }}>
          <h1>😬 Pull Request was {status}!</h1>
          <p style={{ lineHeight: '160%', color: 'white' }}>
            Whoops, looks like there was some sort of a coordination problem. Don't worry,
            none of your work is lost, you can reopen the task if necessary. But for now
            you'll need to go back to the "Tasks" screen, and you'll probably want to
            contact Jared or Jason, or leave a slack in the <code>#asciidoc</code>{' '}
            channel.
          </p>
        </div>
      );
    }

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
        <KeyEvent handleKeys={['meta+Up', 'ctrl+Up']} onKeyEvent={increaseFontSize} />
        <KeyEvent handleKeys={['meta+Down', 'ctrl+Down']} onKeyEvent={decreaseFontSize} />
        <KeyEvent
          handleKeys={['meta+ctrl+7', 'alt+ctrl+7']}
          onKeyEvent={toggleSidebarOpen}
        />
        <KeyEvent handleKeys={['meta+Z', 'ctrl+Z']} onKeyEvent={undo} />
        <KeyEvent handleKeys={['meta+shift+Z', 'ctrl+shift+Z']} onKeyEvent={redo} />
        <KeyEvent
          handleKeys={['meta+F', 'ctrl+F']}
          onKeyEvent={(_: any, event: any) => {
            find();
            event.preventDefault();
          }}
        />
      </Wrap>
    );
  }
}

const mapState = (state: AppState) => {
  return {
    task: requireCurrentTask(state),
  };
};

const mapDispatch = {
  checkout: actions.checkout,
  undo: actions.undoTasks,
  redo: actions.redoTasks,
  find: actions.findInCurrentFile,
  toggleSidebarOpen: actions.toggleSidebarOpen,
  increaseFontSize: actions.increaseEditorFontSize,
  decreaseFontSize: actions.decreaseEditorFontSize,
  syncTask: actions.syncPullRequestStatus,
};

export default connect(
  mapState,
  mapDispatch,
)(Work);
