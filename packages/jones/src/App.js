// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import * as screens from './screens';
import * as actions from './actions';
import Login from './components/Login';

class App extends React.Component<*> {

  componentDidMount() {
    const query = new URLSearchParams(window.location.search);
    if (query.has('access_token')) {
      const { receiveAccessToken } = this.props;
      receiveAccessToken(query.get('access_token'));
    }
  }

  renderScreen() {
    const { screen, loggedIn } = this.props;
    if (!loggedIn) {
      return <Login />
    }
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
    return (
      <div>
        {this.renderScreen()}
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
}

export default connect(mapState, mapDispatch)(App);
