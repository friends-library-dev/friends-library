// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2'
import { withSize } from 'react-sizeme';
import styled from '@emotion/styled/macro';
import type { Asciidoc } from '../../../../../type';
import type { Dispatch } from '../../type';
import { currentTask } from '../../select';
import * as actions from '../../actions';
import { noopObject } from '../../lib/utils';
import Centered from '../Centered';
import StyledEditor from './StyledEditor';
import { modifyEditor } from './codemirror'

import 'codemirror-asciidoc';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';

const isMac = navigator.platform.indexOf('Mac') > -1;

const ChooseAFile = () => (
  <Centered>
    <p style={{ opacity: 0.5 }}>
      <span role="img" aria-label="left">👈 </span> choose a file
    </p>
  </Centered>
);


type Props = {|
  fontSize: number,
  adoc: ?Asciidoc,
  updateFile: Dispatch,
  searching: boolean,
  increaseFontSize: Dispatch,
  decreaseFontSize: Dispatch,
  toggleSidebarOpen: Dispatch,
  path: string,
  size: {| width: number, height: number |},
|};


class Editor extends React.Component<Props> {
  cm: *
  keyCommands: Object

  constructor(props) {
    super(props);
    this.cm = noopObject;
    const { increaseFontSize, decreaseFontSize, toggleSidebarOpen } = props;
    const cmd = isMac ? 'Cmd' : 'Ctrl';
    this.keyCommands = {
      [isMac ? 'Cmd-Ctrl-7' : 'Alt-Ctrl-7']: () => toggleSidebarOpen(),
      [`${cmd}-Up`]: () => increaseFontSize(),
      [`${cmd}-Down`]: () => decreaseFontSize(),
    }
  }

  componentDidUpdate(prev: Props) {
    const { path } = this.props;
    if (path !== prev.path) {
      this.cm.refresh();
      this.cm.scrollIntoView({ ch: 0, line: 0 });
    }
  }

  renderCodeMirror() {
    const { updateFile, adoc, fontSize } = this.props;
    return (
      <CodeMirror
        editorDidMount={(cm) => {
          this.cm = cm;
          modifyEditor(cm);
        }}
        value={adoc}
        onBeforeChange={(ed, data, value) => updateFile(value)}
        options={{
          lineNumbers: true,
          theme: 'darcula',
          mode: 'asciidoc',
          lineWrapping: true,
          extraKeys: this.keyCommands,
          styleActiveLine: true,
        }}
      />
    );
  }

  render() {
    const { adoc, searching, fontSize } = this.props;
    return (
      <StyledEditor searching={searching} fontSize={fontSize}>
        {adoc === null ? <ChooseAFile /> : this.renderCodeMirror()}
      </StyledEditor>
    );
  }
}

const mapState = state => {
  const task = currentTask(state);
  const file = task ? task.files[task.editingFile || ''] : null;
  return {
    fontSize: state.prefs.editorFontSize,
    searching: state.search.searching,
    adoc: file ? file.editedContent || file.content : null,
    path: file ? file.path : '',
  };
};

const mapDispatch = {
  updateFile: actions.updateEditingFile,
  toggleSidebarOpen: actions.toggleSidebarOpen,
  increaseFontSize: actions.increaseEditorFontSize,
  decreaseFontSize: actions.decreaseEditorFontSize,
};

const SizedEditor = withSize({ monitorHeight: true })(Editor);
export default connect(mapState, mapDispatch)(SizedEditor);
