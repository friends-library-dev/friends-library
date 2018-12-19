import React, { Component } from 'react';
import { connect } from "react-redux";
import { getFriendRepos } from './lib/friend-repos';
import { RECEIVE_REPOS } from './actions';


const Repos = ({ repos }) => (
  <ul>
    {repos.map(repo => <Repo repo={repo} key={repo.name} />)}
  </ul>
);

const Repo = ({ repo }) => (
  <li>{repo.name}</li>
);

// const {app} = window.require('electron').remote;


class App extends Component {

  async componentDidMount() {
    const { repos, receiveRepos } = this.props;
    if (repos.length === 0) {
      const received = await getFriendRepos();
      receiveRepos(received);
    }
  }

  render() {
    const { repos } = this.props;
    if (repos.length === 0) {
      return null;
    }
    return (
      <div>
        <Repos repos={repos} />
      </div>
    );
  }
}

const mapState = state => ({
  repos: state.repos,
});

const mapDispatch = {
  receiveRepos: RECEIVE_REPOS,
};

export default connect(mapState, mapDispatch)(App);
