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
  background: #555;
  width: 100%;
  height: 100%;

  & .ace_editor {
    width: 100% !important;
    height: 100% !important;
  }
`;

type Props = {|
  filepath: string,
  content?: Asciidoc,
  receiveFileContent: (any) => *,
|};

class Editor extends React.Component<Props> {

  componentDidMount() {
    this.requestFile();
  }

  componentDidUpdate() {
    this.requestFile();
  }

  requestFile() {
    const { filepath, content, receiveFileContent } = this.props;
    if (null === content) {
      ipcRenderer.send('request:filecontent', filepath);
      ipcRenderer.once('RECEIVE_FILE_CONTENT', (_, path, received) => {
        if (path === filepath) {
          const [
            filename,
            editionType,
            documentSlug,
            friendSlug,
            lang,
          ] = path.split('/').reverse();

          receiveFileContent({
            lang,
            friendSlug,
            documentSlug,
            editionType,
            filename,
            content: received,
          });
        }
      });
    }
  }

  render() {
    const { content } = this.props;
    return (
      <Wrap>
        <AceEditor
          mode="asciidoc"
          theme="tomorrow_night"
          onChange={() => {}}
          value={content || ''}
          editorProps={{$blockScrolling: true}}
        />
      </Wrap>
    );
  }
}

const mapState = state => {
  if (!state.editingFile) {
    return { filepath: '', content: '' };
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
  receiveFileContent: actions.receiveFileContent,
};

export default connect(mapState, mapDispatch)(Editor);
