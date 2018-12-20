// @flow
import * as React from 'react';
import { connect } from "react-redux";
import { getFriendRepos } from './lib/friend-repos';
import { receiveRepos, receiveFriend } from './actions';
import { ipcRenderer } from './webpack-electron';
import * as screens from './screens';
import Welcome from './components/Welcome';
import EditTask from './components/EditTask';
import Work from './components/Work';

class App extends React.Component<*> {

  async componentDidMount() {
    const { repos, receiveRepos, receiveFriend } = this.props;
    ipcRenderer.on('RECEIVE_FRIEND', (_, friend, lang) => {
      receiveFriend({ friend, lang });
    });

    if (repos.length === 0) {
      const received = await getFriendRepos();
      receiveRepos(received);
      ipcRenderer.send('receive:repos', received);
    }
  }

  renderScreen() {
    const { screen } = this.props;
    switch (screen) {
      case screens.WELCOME:
        return <Welcome />;
      case screens.EDIT_TASK:
        return (<EditTask />);
      case screens.WORK:
        return (<Work />);
      default:
        return null;
    }
  }

  render() {
    return (
      <div>
        {this.renderScreen()}
        <span style={{
          position: 'absolute',
          bottom: 5,
          left: 5,
          cursor: 'pointer',
        }} onClick={() => {
          try {
            sessionStorage.removeItem('state');
            window.location.reload();
          } catch (e) {}
        }}>RESET</span>
      </div>
    );
  }
}

const mapState = state => ({
  repos: state.repos,
  screen: state.screen,
});

const mapDispatch = {
  receiveRepos,
  receiveFriend,
};

export default connect(mapState, mapDispatch)(App);
