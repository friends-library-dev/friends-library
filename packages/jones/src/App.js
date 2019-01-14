// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import KeyEvent from 'react-keyboard-event-handler';
import * as screens from './screens';
import * as actions from './actions';
import Login from './components/Login';
import TopNav from './components/TopNav';

const isDev = process.env.NODE_ENV === 'development';

class App extends React.Component<*> {

  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    if (query.has('access_token')) {
      const { receiveAccessToken } = this.props;
      receiveAccessToken(query.get('access_token'));
      window.location.replace('/');
    }
  }

  renderScreen() {
    const { screen } = this.props;

    switch (screen) {
      case screens.TASKS:
        return <h1>tasks</h1>;//<Tasks />;
      case screens.EDIT_TASK:
        return <h1>edit task</h1>;//<Tasks />;
      case screens.WORK:
        return <h1>work</h1>;//<Tasks />;
      default:
        return null;
    }
  }

  render() {
    const { loggedIn, hardReset } = this.props;
    if (!loggedIn) {
      return <Login />
    }

    return (
      <div>
        <TopNav />
        {this.renderScreen()}
        {isDev && <KeyEvent
          handleKeys={['meta+1']}
          onKeyEvent={hardReset}
        />}
      </div>
    );
  }
}

const mapState = state => ({
  loggedIn: state.github.token !== null,
  screen: state.screen,
});

const mapDispatch = {
  receiveAccessToken: actions.receiveAccessToken,
  hardReset: actions.hardReset,
}

export default connect(mapState, mapDispatch)(App);
