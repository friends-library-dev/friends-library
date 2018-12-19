// @flow
import * as React from 'react';
import { connect } from "react-redux";
import AceEditor from 'react-ace';
import { getFriendRepos } from './lib/friend-repos';
import { RECEIVE_REPOS, RECEIVE_FRIEND } from './actions';
import { ipcRenderer } from './webpack-electron';
import 'brace/mode/asciidoc';
import 'brace/theme/solarized_dark';


const Repos = ({ repos }) => (
  <ul>
    {repos.map(repo => <Repo repo={repo} key={repo.slug} />)}
  </ul>
);

const Repo = ({ repo }) => (
  <li>{repo.slug}</li>
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

  render() {
    const { repos, friends } = this.props;
    if (repos.length === 0) {
      return null;
    }
    return (
      <div>
        { false && <AceEditor
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
        }}/>}
        <Repos repos={repos} />
      </div>
    );
  }
}

const mapState = state => ({
  repos: state.repos,
  friends: state.friends,
});

const mapDispatch = {
  receiveRepos: RECEIVE_REPOS,
  receiveFriend: RECEIVE_FRIEND,
};

export default connect(mapState, mapDispatch)(App);
