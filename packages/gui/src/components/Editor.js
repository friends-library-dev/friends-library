// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { withSize } from 'react-sizeme';
import styled from '@emotion/styled';
import type { Asciidoc } from '../../../../type';
import type { Dispatch } from '../redux/type';
import { editingFile } from '../redux/select';
import { ipcRenderer as ipc } from '../webpack-electron';
import * as actions from '../redux/actions';
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
  fontSize: number,
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
    this.addKeyCommands();
  }

  componentDidUpdate(prev) {
    const { size, searching } = this.props;
    if (size.width !== prev.size.width || searching !== prev.searching) {
      this.editor().resize();
    }

    // ace seems to sometimes lose commands ¯\_(ツ)_/¯
    if (!this.editor().commands.commands.increaseFontSize) {
      this.addKeyCommands();
    }

    this.maybeRequestFileContent();
  }

  addKeyCommands() {
    this.editor().commands.addCommand({
      name: 'save',
      bindKey: { mac: 'Command-S', win: 'Ctrl-S' },
      exec: () => ipc.send('forward:editor:key-event', 'Cmd+S'),
    });

    this.editor().commands.addCommand({
      name: 'increaseFontSize',
      bindKey: { mac: 'Command-Up', win: 'Ctrl-Up' },
      exec: () => ipc.send('forward:editor:key-event', 'Cmd+Up'),
    });

    this.editor().commands.addCommand({
      name: 'decreaseFontSize',
      bindKey: { mac: 'Command-Down', win: 'Ctrl-Down' },
      exec: () => ipc.send('forward:editor:key-event', 'Cmd+Down'),
    });
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
      ipc.send('request:filecontent', filepath);
      ipc.once('UPDATE_FILE_CONTENT', (_, path, received) => {
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
    const { updateFile, adoc, searching, fontSize } = this.props;
    return (
      <Wrap searching={searching}>
        {adoc !== null && (
          <AceEditor
            style={{ fontSize }}
            ref={this.aceRef}
            mode="asciidoc"
            theme="tomorrow_night"
            onChange={editedContent => updateFile({ editedContent })}
            value={adoc}
            editorProps={{ $blockScrolling: true }}
            setOptions={{ wrap: true }}
          />
        )}
      </Wrap>
    );
  }
}

const mapState = state => {
  const file = editingFile(state);
  return {
    fontSize: state.prefs.editorFontSize,
    searching: state.search.searching,
    filepath: file ? file.path : '',
    adoc: file ? file.editedContent : null,
  };
};

const mapDispatch = {
  updateFile: actions.updateEditingFile,
};

const SizedEditor = withSize({ monitorHeight: true })(Editor);
export default connect(mapState, mapDispatch)(SizedEditor);
