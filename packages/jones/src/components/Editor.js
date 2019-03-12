// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { withSize } from 'react-sizeme';
import debounce from 'lodash/debounce';
import type { Asciidoc } from '../../../../type';
import type { Dispatch } from '../type';
import { currentTask } from '../select';
import * as actions from '../actions';
import Centered from './Centered';
import StyledEditor from './StyledEditor';
import { italicize } from '../lib/format';
import * as api from '../lib/api';
import './adoc-mode';
import './adoc-snippets';
import 'brace/theme/tomorrow_night';

const noopEditor = new Proxy({}, {
  get(target, prop, receiver) {
    const fn = () => receiver;
    Object.setPrototypeOf(fn, receiver);
    return fn;
  },
});

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
  undo: Dispatch,
  redo: Dispatch,
  find: Dispatch,
  searching: boolean,
  editingFile: string,
  increaseFontSize: Dispatch,
  decreaseFontSize: Dispatch,
  toggleSidebarOpen: Dispatch,
  size: {| width: number, height: number |},
|};


class Editor extends React.Component<Props> {
  aceRef: any

  constructor(props) {
    super(props);
    this.aceRef = React.createRef();
  }

  componentDidMount() {
    this.addKeyCommands();
    this.editor().focus();
    this.editor().gotoLine(0);
    this.editor().setPrintMarginColumn(90);
    this.checkLint(this.editor().getValue());
  }

  componentDidUpdate(prev) {
    const { size, searching, editingFile } = this.props;
    if (size.width !== prev.size.width || searching !== prev.searching) {
      this.editor().resize();
    }

    if (editingFile !== prev.editingFile) {
      this.editor().getSession().setUndoManager(new window.ace.UndoManager())
    }

    // ace seems to sometimes lose commands ¯\_(ツ)_/¯
    if (!this.editor().commands.commands.increaseFontSize) {
      this.addKeyCommands();
    }
  }

  checkLint(adoc) {
    api.postEncodedAsciidoc('/lint/check', adoc)
      .then(res => res.json())
      .then(lints => lints.filter(l => l.fixable !== true))
      .then(lints => lints.filter(l => l.rule !== 'temporary-comments'))
      .then(lints => this.annotateLintErrors(lints))
      .catch(() => {});
  }

  annotateLintErrors(lints) {
    this.editor().getSession().setAnnotations(lints.map(lint => {
      let text = lint.message;
      if (lint.recommendation) {
        text += `\n\nRecommended fix:\n\n${lint.recommendation}`;
      }
      return {
        row: lint.line - 1,
        column: lint.column,
        text,
        type: 'warning',
      }
    }));
  }

  addKeyCommands() {
    const {
      increaseFontSize,
      decreaseFontSize,
      toggleSidebarOpen,
      undo,
      redo,
      find,
    } = this.props;

    const editor = this.editor();

    editor.commands.addCommand({
      name: 'increaseFontSize',
      bindKey: { mac: 'Command-Up', win: 'Ctrl-Up' },
      exec: () => increaseFontSize(),
    });

    editor.commands.addCommand({
      name: 'decreaseFontSize',
      bindKey: { mac: 'Command-Down', win: 'Ctrl-Down' },
      exec: () => decreaseFontSize(),
    });

    editor.commands.addCommand({
      name: 'toggleSidebarOpen',
      bindKey: { mac: 'Command-Ctrl-7', win: 'Alt-Ctrl-7' },
      exec: () => toggleSidebarOpen(),
    });

    editor.commands.addCommand({
      name: 'find',
      bindKey: { mac: 'Command-F', win: 'Ctrl-F' },
      exec: () => find(),
    });

    editor.commands.addCommand({
      name: 'undo',
      bindKey: { mac: 'Command-Z', win: 'Ctrl-Z' },
      exec: () => undo(),
    });

    editor.commands.addCommand({
      name: 'redo',
      bindKey: { mac: 'Command-Shift-Z', win: 'Alt-Shift-Z' },
      exec: () => redo(),
    });

    editor.commands.addCommand({
      name: 'italicize',
      bindKey: { mac: 'Command-I', win: 'Ctrl-I' },
      exec: () => {
        const selected = editor.getSelectedText();
        const range = editor.getSelectionRange();
        const firstLine = editor.session.getLine(range.start.row);
        const lastLine = editor.session.getLine(range.end.row);
        const replacement = italicize(selected, firstLine, lastLine, range);
        editor.session.replace(range, replacement);
      }
    })
  }

  editor() {
    if (this.aceRef.current && this.aceRef.current.editor) {
      return this.aceRef.current.editor;
    }
    return noopEditor;
  }

  renderAce() {
    const { updateFile, adoc, fontSize } = this.props;
    return (
      <AceEditor
        style={{ fontSize }}
        ref={this.aceRef}
        mode="adoc"
        theme="tomorrow_night"
        onChange={debounce((adoc) => {
          updateFile(adoc);
          this.checkLint(adoc);
        }, 500)}
        value={adoc || ''}
        editorProps={{ $blockScrolling: true }}
        setOptions={{
          enableSnippets: true,
          indentedSoftWrap: false,
          wrap: true, // !!! <- must be after `indentedSoftWrap`
        }}
      />
    );
  }

  render() {
    const { adoc, searching } = this.props;
    return (
      <StyledEditor searching={searching} className="Editor">
        {adoc === null ? <ChooseAFile /> : this.renderAce()}
      </StyledEditor>
    );
  }
}

const mapState = state => {
  const task = currentTask(state);
  const file = task ? task.files[task.editingFile || ''] : null;
  return {
    editingFile: task ? task.editingFile : '',
    fontSize: state.prefs.editorFontSize,
    searching: state.search.searching,
    adoc: file ? file.editedContent || file.content : null,
  };
};

const mapDispatch = {
  updateFile: actions.updateEditingFile,
  toggleSidebarOpen: actions.toggleSidebarOpen,
  undo: actions.undoTasks,
  redo: actions.redoTasks,
  find: actions.findInCurrentFile,
  increaseFontSize: actions.increaseEditorFontSize,
  decreaseFontSize: actions.decreaseEditorFontSize,
};

const SizedEditor = withSize({ monitorHeight: true })(Editor);
export default connect(mapState, mapDispatch)(SizedEditor);
