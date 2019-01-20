// @flow
import * as React from 'react';
import { connect } from 'react-redux';
import AceEditor from 'react-ace';
import { withSize } from 'react-sizeme';
import type { Asciidoc } from '../../../../type';
import type { Dispatch } from '../type';
import { currentTask } from '../select';
import * as actions from '../actions';
import Centered from './Centered';
import StyledEditor from './StyledEditor';
import './adoc-mode';
import 'brace/ext/searchbox';
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
  searching: boolean,
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
  }

  addKeyCommands() {
    const { increaseFontSize, decreaseFontSize, toggleSidebarOpen } = this.props;
    this.editor().commands.addCommand({
      name: 'increaseFontSize',
      bindKey: { mac: 'Command-Up', win: 'Ctrl-Up' },
      exec: () => increaseFontSize(),
    });

    this.editor().commands.addCommand({
      name: 'decreaseFontSize',
      bindKey: { mac: 'Command-Down', win: 'Ctrl-Down' },
      exec: () => decreaseFontSize(),
    });

    this.editor().commands.addCommand({
      name: 'toggleSidebarOpen',
      bindKey: { mac: 'Command-Ctrl-7', win: 'Alt-Ctrl-7' },
      exec: () => toggleSidebarOpen(),
    });
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
        onChange={updateFile}
        value={adoc || ''}
        editorProps={{ $blockScrolling: true }}
        setOptions={{ wrap: true }}
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
    fontSize: state.prefs.editorFontSize,
    searching: state.search.searching,
    adoc: file ? file.editedContent || file.content : null,
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
