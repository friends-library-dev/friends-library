// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { withSize } from 'react-sizeme';
import styled from '@emotion/styled';
import type { Asciidoc } from '../../../../type';
import type { Dispatch } from '../redux/type';
import { ipcRenderer } from '../webpack-electron';
import * as actions from '../redux/actions';
import SaveEditedFiles from './SaveEditedFiles';
import 'brace/ext/searchbox';
import 'brace/mode/asciidoc';
import 'brace/theme/tomorrow_night';


const noopEditor = new Proxy({}, {
  get(target, prop, receiver) {
    const fn = () => receiver;
    Object.setPrototypeOf(fn, receiver);
    return fn;
  },
});

const Wrap = styled.div`
  position: relative;
  z-index: 1;
  background: #555;
  width: 100%;
  height: ${p => p.searching ? 'auto' : '100%'};

  & .ace_editor {
    width: 100% !important;
    height: ${(p) => p.searching ? 'calc(35vh - 35px)' : '100%'} !important;
  }
`;


type Props = {|
  filepath: string,
  adoc: ?Asciidoc,
  updateFile: Dispatch,
  searching: boolean,
  size: {| width: number, height: number |},
|};


class Editor extends React.Component<Props> {
  aceRef: any

  constructor(props) {
    super(props);
    this.aceRef = React.createRef();
  }

  componentDidMount() {
    this.maybeRequestFileContent();
  }

  componentDidUpdate(prev) {
    const { size, searching } = this.props;
    if (size.width !== prev.size.width || searching !== prev.searching) {
      this.editor().resize();
    }

    this.maybeRequestFileContent();
  }

  editor() {
    if (this.aceRef.current && this.aceRef.current.editor) {
      return this.aceRef.current.editor;
    }
    return noopEditor;
  }

  maybeRequestFileContent() {
    const { filepath, adoc, updateFile } = this.props;
    if (filepath && adoc === null) {
      ipcRenderer.send('request:filecontent', filepath);
      ipcRenderer.once('UPDATE_FILE_CONTENT', (_, path, received) => {
        if (path === filepath) {
          updateFile({
            diskContent: received,
            editedContent: received,
          });
        }
      });
    }
  }

  render() {
    const { updateFile, adoc, searching } = this.props;
    return (
      <Wrap searching={searching}>
        {(adoc !== null && true) && (
          <AceEditor
            ref={this.aceRef}
            mode="asciidoc"
            theme="tomorrow_night"
            onChange={editedContent => updateFile({ editedContent })}
            value={adoc}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ wrap: true }}
          />
        )}
        <SaveEditedFiles editor={this.editor()} />
      </Wrap>
    );
  }
}

const mapState = state => {
  if (!state.editingFile) {
    return {
      editingFile: {},
      filepath: '',
      adoc: null,
    };
  }

  const { lang, friend, document, edition, filename } = state.editingFile;
  const doc = state.friends[`${lang}/${friend}`].documents[document];
  const file = doc.editions[edition].files[filename];

  return {
    searching: state.search.searching,
    editingFile: state.editingFile,
    filepath: file.path,
    adoc: file.editedContent,
  };
};

const mapDispatch = {
  updateFileContent: actions.updateFileContent,
};

const merge = (state, dispatch) => ({
  filepath: state.filepath,
  adoc: state.adoc,
  searching: state.searching,
  updateFile: content => {
    dispatch.updateFileContent({
      lang: state.editingFile.lang,
      friendSlug: state.editingFile.friend,
      documentSlug: state.editingFile.document,
      editionType: state.editingFile.edition,
      filename: state.editingFile.filename,
      ...content,
    });
  },
});

export default connect(mapState, mapDispatch, merge)(withSize({ monitorHeight: true })(Editor));
