// @flow
import * as React from 'react';
import { connect } from "react-redux";
import { getFriendRepos } from './lib/friend-repos';
import { RECEIVE_REPOS } from './actions';
import fs from 'fs';
import AceEditor from 'react-ace';
import brace from 'brace';
import 'brace/mode/asciidoc';
import 'brace/theme/solarized_dark';


const Repos = ({ repos }) => (
  <ul>
    {repos.map(repo => <Repo repo={repo} key={repo.name} />)}
  </ul>
);

const Repo = ({ repo }) => (
  <li>{repo.name}</li>
);

const adoc = `
== Chapter 1

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

[.foo]
* foo
* bar

`.trim();

const { ipcRenderer } = window.require('electron');

// const pen = window.require('fs').readFileSync(`../friends/yml/en/isaac-penington.yml`);
// console.log(pen.toString());

class App extends React.Component<*> {

  async componentDidMount() {
    const { repos, receiveRepos } = this.props;
    if (repos.length === 0) {
      const received = await getFriendRepos();
      receiveRepos(received);
      ipcRenderer.send('receive:repos', received);
    }
  }

  render() {
    const { repos } = this.props;
    if (repos.length === 0) {
      return null;
    }
    return (
      <div>
        <AceEditor
          mode="asciidoc"
          theme="solarized_dark"
          name="blah2"
          onLoad={() => {}}
          onChange={(...args) => console.log(args)}
          fontSize={14}
          showPrintMargin={true}
          showGutter={true}
          highlightActiveLine={true}
          value={adoc}
          setOptions={{
          enableBasicAutocompletion: false,
          enableLiveAutocompletion: false,
          enableSnippets: false,
          showLineNumbers: true,
          tabSize: 2,
          }}/>
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
