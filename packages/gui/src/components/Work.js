// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import styled from '@emotion/styled';
import AceEditor from 'react-ace';
import { ipcRenderer } from '../webpack-electron';
import * as actions from '../actions';
import 'brace/mode/asciidoc';
import 'brace/theme/tomorrow_night';

const Wrap = styled.div`
  display: flex;
  height: calc(100vh - 30px);
  margin: -1em -2em;
`;

const Sidebar = styled.div`
  background: #333;
  flex: 1 0 0;
  overflow: auto;
`;

const EditorPane = styled.div`
  background: #555;
  flex: 2 0 0;

  & .ace_editor {
    width: 100% !important;
    height: 100% !important;
  }
`;

const Loading = styled.h1`
  text-align: center;
  line-height: calc(100vh - 30px);
  opacity: 0.3;
`;

const File = styled.li`
  list-style: none;
  padding: 0.5em;
  padding-left: 2.5em;
  font-family: monospace;
  font-size: 12px;
  cursor: pointer;
  &:hover {
    background: #232323;
  }
`;


class Work extends React.Component<*, *> {

  state = {
    selectedFile: null,
  };

  componentDidMount() {
    const { selectedFile } = this.state;
    const { receiveRepoFiles, receiveFileContent, friend } = this.props;
    if (!friend.files) {
      ipcRenderer.send('request:files', friend.slug);
    }
    ipcRenderer.on('RECEIVE_REPO_FILES', (_, friendSlug, files) => {
      receiveRepoFiles({ friendSlug, files });
    });
    ipcRenderer.on('RECEIVE_FILE_CONTENT', (_, fullPath, content) => {
      receiveFileContent({
        friendSlug: friend.slug,
        fullPath,
        content,
      });
    });
  }

  selectFile(relPath) {
    const { friend } = this.props;
    const file = friend.files.find(f => f.relPath === relPath);
    this.setState({ selectedFile: file });
    if (file.content === null) {
      console.log('request the file content! for:', file.fullPath);
      ipcRenderer.send('request:filecontent', file.fullPath);
    }
  }

  renderFiles() {
    const { friend } = this.props;
    if (!friend.files) {
      return (
        <Loading>
          Loading...
        </Loading>
      );
    }
    return (
      <ul style={{ padding: 0 }}>
        {friend.files.map(({ relPath }) => (
          <File onClick={() => this.selectFile(relPath)} key={relPath}>
            {relPath}
          </File>
        ))}
      </ul>
    )
  }

  render() {
    const { selectedFile } = this.state;
    console.log(selectedFile);
    return (
      <Wrap>
        <Sidebar>
          {this.renderFiles()}
        </Sidebar>
        <EditorPane>
          <AceEditor
            mode="asciidoc"
            theme="tomorrow_night"
            onChange={() => {}}
            value={selectedFile && selectedFile.content ? selectedFile.content : ''}
            editorProps={{$blockScrolling: true}}
          />
        </EditorPane>
      </Wrap>
    );
  }
};

const mapState = state => {
  const task = state.tasks.find(({ id }) => id === state.currentTask);
  return {
    friend: state.friends[`en/${task.repo}`],
    task,
  };
};

const mapDispatch = {
  receiveRepoFiles: actions.receiveRepoFiles,
  receiveFileContent: actions.receiveFileContent,
};

export default connect(mapState, mapDispatch)(Work);
