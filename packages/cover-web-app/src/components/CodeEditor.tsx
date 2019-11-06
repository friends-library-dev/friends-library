import React from 'react';
import AceEditor from 'react-ace';
import { Css, Html } from '@friends-library/types';
import './CodeEditor.css';
import 'brace/theme/pastel_on_dark';
import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/ext/emmet';

const options = {
  wrapBehavioursEnabled: true,
  indentedSoftWrap: true,
  useSoftTabs: true,
  tabSize: 2,
  showPrintMargin: false,
};

interface Props {
  css: Css;
  html: Html;
  updateCss: (css: Css) => void;
  updateHtml: (html: Html) => void;
}

export default class CodeEditor extends React.Component<Props> {
  private htmlEditor = React.createRef<AceEditor>();
  private cssEditor = React.createRef<AceEditor>();

  public componentDidMount(): void {
    const editor = (this.htmlEditor.current as any).editor;
    editor.setOption('wrap', 'free');
    editor.setOption('enableEmmet', true);
  }

  public render(): JSX.Element {
    const { css, html, updateHtml, updateCss } = this.props;
    return (
      <div className="code-editor">
        <div className="panel panel--html">
          <h1>{`<!-- Custom HTML -->`}</h1>
          <AceEditor
            ref={this.htmlEditor}
            theme="pastel_on_dark"
            mode="html"
            value={html}
            onChange={updateHtml}
            setOptions={options}
            editorProps={{ $blockScrolling: Infinity }}
          />
        </div>
        <div className="panel panel--css">
          <h1>/* Custom CSS */</h1>
          <AceEditor
            ref={this.cssEditor}
            theme="pastel_on_dark"
            mode="css"
            value={css}
            onChange={updateCss}
            setOptions={options}
            editorProps={{ $blockScrolling: Infinity }}
          />
        </div>
      </div>
    );
  }
}
