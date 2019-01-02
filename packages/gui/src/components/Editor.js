// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import styled from '@emotion/styled';
import type { Asciidoc } from '../../../../type';
import { ipcRenderer } from '../webpack-electron';
import * as actions from '../redux/actions';
import 'brace/ext/searchbox';
import 'brace/mode/asciidoc';
import 'brace/theme/tomorrow_night';

const Wrap = styled.div`
  position: relative;
  background: #555;
  width: 100%;
  height: 100%;

  & .ace_editor {
    width: 100% !important;
    height: 100% !important;
  }
`;

const Save = styled.button`
  position: fixed;
  top: 0;
  right: 18px;
  border-width: 0;
  padding: 0.75em 1.5em;
  opacity: ${({ enabled }) => enabled ? 0.75 : 0.1 };
  z-index: 11;
  background: var(--accent);
  color: #000;
`;

type Props = {|
  filepath: string,
  content?: Asciidoc,
  updateFileContent: (any) => *,
|};

type State = {|
  edited?: boolean,
  current?: Asciidoc,
|};

class Editor extends React.Component<Props, State> {

  constructor(props) {
    super(props);

    this.state = {
      current: props.content,
      edited: false,
    }
  }

  componentDidMount() {
    this.maybeRequestFileContent();
  }

  componentDidUpdate(prevProps) {
    const { filepath, content } = this.props;
    if (prevProps.filepath !== filepath || (prevProps.content === null && content !== null)) {
      this.setState({ current: content });
    }
    this.maybeRequestFileContent();
  }

  maybeRequestFileContent() {
    const { filepath, content, updateFileContent } = this.props;
    if (filepath && null === content) {
      ipcRenderer.send('request:filecontent', filepath);
      ipcRenderer.once('UPDATE_FILE_CONTENT', (_, path, received) => {
        if (path === filepath) {
          updateFileContent({
            ...this.editingFile(),
            content: received,
          });
        }
      });
    }
  }

  editingFile() {
    const { filepath } = this.props;
    const [
      filename,
      editionType,
      documentSlug,
      friendSlug,
      lang,
    ] = filepath.split('/').reverse();

    return {
      lang,
      friendSlug,
      documentSlug,
      editionType,
      filename,
    };
  }

  save = () => {
    const { current } = this.state;
    const { filepath, updateFileContent } = this.props;
    updateFileContent({
      ...this.editingFile(),
      content: current,
    });
    ipcRenderer.send('save:file', filepath, current);
  }

  render() {
    const { current } = this.state;
    const { content } = this.props;
    return (
      <Wrap>
        <Save enabled={current !== content} onClick={this.save}>Save</Save>
        <AceEditor
          mode="asciidoc"
          theme="tomorrow_night"
          onChange={(val, event) => {
            this.setState({ current: val });
          }}
          value={current || ''}
          editorProps={{$blockScrolling: true}}
          setOptions={{ wrap: true }}
        />
      </Wrap>
    );
  }
}

const mapState = state => {
  if (!state.editingFile) {
    return { filepath: '', content: null };
  }
  const { lang, friend, document, edition, filename } = state.editingFile;
  const doc = state.friends[`${lang}/${friend}`].documents[document];
  const file = doc.editions[edition].files[filename];

  return {
    filepath: file.path,
    content: file.content,
  };
};

const mapDispatch = {
  updateFileContent: actions.updateFileContent,
};

export default connect(mapState, mapDispatch)(Editor);
