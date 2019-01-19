// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import { Controlled as CodeMirror } from 'react-codemirror2'
import { withSize } from 'react-sizeme';
import styled from '@emotion/styled/macro';
import type { Asciidoc } from '../../../../type';
import type { Dispatch } from '../type';
import { currentTask } from '../select';
import * as actions from '../actions';
import Centered from './Centered';
import throttle from 'lodash/throttle';
import 'codemirror-asciidoc';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/darcula.css';

const isMac = navigator.platform.indexOf('Mac') > -1;

const noopEditor = new Proxy({}, {
  get(target, prop, receiver) {
    const fn = () => receiver;
    Object.setPrototypeOf(fn, receiver);
    return fn;
  },
});

const EditorWrap = styled.div`
  position: relative;
  z-index: 1;
  background: #555;
  width: 100%;
  height: ${p => p.searching ? 'calc(35vh - 50px)' : '100%'};

  .react-codemirror2,
  .CodeMirror {
    width: 100% !important;
    height: ${(p) => p.searching ? 'calc(35vh - 50px)' : '100%'} !important;
  }

  .CodeMirror {
    font-family: Menlo, Consolas, "DejaVu Sans Mono", monospace;
    font-size: ${p => p.fontSize}px;
    background: #202125;
    color: #bbb;
    line-height: 140%;
  }

  .CodeMirror-gutters {
    background: #202125;
    border-right-color: #202125;
  }

  .CodeMirror-linenumber {
    padding-left: 10px;
    padding-right: 10px;
    color: #555;
  }

  .cm-header,
  .adoc--white {
    color: white;
    font-style: bold;
  }

  .cm-string-2,
  .cm-atom,
  .adoc--grey {
    color: rgba(171, 178, 191, 0.5) !important;
  }

  .cm-builtin,
  .adoc--orange {
    color: #d19a66 !important;
  }

  .adoc--red {
    color: #cc6b73 !important;
  }

  .cm-variable-2,
  .cm-keyword,
  .adoc--blue {
    color: #61afef !important;
  }

  .cm-variable-2 + .cm-keyword,
  .adoc--green {
    color: #98c379 !important;
  }

  .cm-string,
  .adoc--purple {
    color: #c678dd !important;
    font-style: italic !important;
  }
`;

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
    this.cm = noopEditor;
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
        editorDidMount={e => {
          const quoteDelimiters = new Set();
          e.on('renderLine', (cm, line, el) => {
            const { line: lineNumber } = cm.lineInfo(line);

            if (line.text === '____') {
              quoteDelimiters.add(lineNumber)
              const span = el.querySelector('.cm-variable-2');
              if (span) {
                span.classList = 'adoc--purple';
              }
            } else {
              quoteDelimiters.delete(lineNumber);

              const ordered = [...quoteDelimiters];
              const inQuote = ordered.filter(ln => ln < lineNumber).length % 2;

              if (inQuote) {
                const span = el.querySelector('span');
                if (span) {
                  span.classList = 'adoc--purple';
                }
              }
            }

            // console.log(quoteDelimiters.values())


            if (line.text.indexOf('* ') === 0) {
              const span = el.querySelector('.cm-keyword');
              if (span) {
                span.classList = 'adoc--red';
              }
            }

            if (line.text.indexOf('[') === 0) {
              // console.log(line, el);
            }
          });
          e.refresh();
          this.cm = e;
        }}
        value={adoc}
        onBeforeChange={(ed, data, value) => updateFile(value)}
        options={{
          lineNumbers: true,
          theme: 'darcula',
          mode: 'asciidoc',
          lineWrapping: true,
          // viewportMargin: Infinity,
          extraKeys: this.keyCommands,
        }}
      />
    );
  }

  render() {
    const { adoc, searching, fontSize } = this.props;
    return (
      <EditorWrap searching={searching} fontSize={fontSize}>
        {adoc === null ? <ChooseAFile /> : this.renderCodeMirror()}
      </EditorWrap>
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
