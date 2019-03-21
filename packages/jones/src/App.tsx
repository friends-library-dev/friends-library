import * as React from 'react';
import { connect } from 'react-redux';
import KeyEvent from 'react-keyboard-event-handler';
import * as screens from './screens';
import * as actions from './actions';
import Login from './components/Login';
import TopNav from './components/TopNav';
import Tasks from './components/Tasks';
import EditTask from './components/EditTask';
import Work from './components/Work';
import Preview from './components/Preview';
import { State, Dispatch } from './type';

const isDev = process.env.NODE_ENV === 'development';

type Props = {
  loggedIn: boolean;
  screen: string;
  receiveAccessToken: Dispatch;
  hardReset: Dispatch;
};

class App extends React.Component<Props> {
  componentDidMount() {
    const { receiveAccessToken } = this.props;
    const query = new URLSearchParams(window.location.search);
    if (query.has('access_token')) {
      receiveAccessToken(query.get('access_token'));
      // wait for indexeddb to store query token before refreshing
      Promise.resolve().then(() => window.location.replace('/'));
    }
  }

  renderScreen() {
    const { screen } = this.props;

    switch (screen) {
      case screens.TASKS:
        return <Tasks />;
      case screens.EDIT_TASK:
        return <EditTask />;
      case screens.WORK:
        return <Work />;
      default:
        return null;
    }
  }

  render() {
    const { loggedIn, hardReset } = this.props;
    if (!loggedIn) {
      return <Login />;
    }

    const query = new URLSearchParams(window.location.search);
    if (query.get('preview') && query.get('task') && query.get('file')) {
      const taskId = query.get('task') as string;
      const file = query.get('file') as string;
      return <Preview taskId={taskId} file={file} />;
    }

    return (
      <>
        <TopNav />
        <div style={{ height: 'calc(100vh - 50px)' }}>{this.renderScreen()}</div>
        {isDev && <KeyEvent handleKeys={['meta+ctrl+1']} onKeyEvent={hardReset} />}
      </>
    );
  }
}

const mapState = (state: State) => ({
  loggedIn: Boolean(state.github.token),
  screen: state.screen,
});

const mapDispatch = {
  receiveAccessToken: actions.receiveAccessToken,
  hardReset: actions.hardReset,
};

export default connect(
  mapState,
  mapDispatch,
)(App);
