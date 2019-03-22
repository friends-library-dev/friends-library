import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { withSize } from 'react-sizeme';
import debounce from 'lodash/debounce';
import { lint } from '@friends-library/asciidoc';
import { Asciidoc, LintResult } from '@friends-library/types';
import { Dispatch, State } from '../type';
import { requireCurrentTask } from '../select';
import * as actions from '../actions';
import Centered from './Centered';
import StyledEditor from './StyledEditor';
import { addKeyCommands } from './editor-key-commands';
import './adoc-mode';
import './adoc-snippets';
import 'brace/theme/tomorrow_night';

const noopEditor = new Proxy(
  {},
  {
    get(target, prop, receiver) {
      const fn = () => receiver;
      Object.setPrototypeOf(fn, receiver);
      return fn;
    },
  },
);

const ChooseAFile = () => (
  <Centered>
    <p style={{ opacity: 0.5 }}>
      <span role="img" aria-label="left">
        👈{' '}
      </span>{' '}
      choose a file
    </p>
  </Centered>
);

export type Props = {
  fontSize: number;
  adoc?: Asciidoc;
  githubUser: string;
  updateFile: Dispatch;
  undo: Dispatch;
  redo: Dispatch;
  find: Dispatch;
  searching: boolean;
  editingFile: string;
  increaseFontSize: Dispatch;
  decreaseFontSize: Dispatch;
  toggleSidebarOpen: Dispatch;
  size: { width: number; height: number };
};

class Editor extends React.Component<Props> {
  private aceRef = React.createRef<any>();

  componentDidMount() {
    const editor = this.editor();
    addKeyCommands(editor, this.props);
    editor.focus();
    editor.gotoLine(0);
    editor.setPrintMarginColumn(90);
    this.checkLint(editor.getValue());
  }

  componentDidUpdate(prev: Props) {
    const { size, searching } = this.props;
    if (size.width !== prev.size.width || searching !== prev.searching) {
      this.editor().resize();
    }

    // ace seems to sometimes lose commands ¯\_(ツ)_/¯
    if (!this.editor().commands.commands.increaseFontSize) {
      addKeyCommands(this.editor(), this.props);
    }
  }

  checkLint(adoc: unknown) {
    if (typeof adoc !== 'string') {
      return;
    }

    const lints = lint(adoc)
      .filter(
        l => l.fixable !== true || ['join-words', 'obsolete-spellings'].includes(l.rule),
      )
      .filter(l => l.rule !== 'temporary-comments');

    this.annotateLintErrors(lints);
  }

  annotateLintErrors(lints: LintResult[]) {
    this.editor()
      .getSession()
      .setAnnotations(
        lints.map(lint => {
          let text = lint.message;
          if (lint.recommendation) {
            text += `\n\n>> Recommended fix:\n\n${lint.recommendation}`;
          }
          if (lint.info) {
            text += `\n\n>> More info:\n\n${lint.info}`;
          }
          return {
            row: lint.line - 1,
            column: lint.column,
            text,
            type: 'warning',
          };
        }),
      );
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
        onChange={debounce(adoc => {
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

const mapState = (state: State) => {
  const task = requireCurrentTask(state);
  const file = task.files[task.editingFile || ''];
  return {
    githubUser: state.github.token ? state.github.user : '',
    editingFile: task.editingFile,
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
export default connect(
  mapState,
  mapDispatch,
)(SizedEditor);
