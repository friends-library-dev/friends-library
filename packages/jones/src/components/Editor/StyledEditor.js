// @flow
import styled from '@emotion/styled/macro';

const StyledEditor = styled.div`
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
  .cm-variable-2 + .cm-string,
  .adoc--green {
    font-style: normal !important;
    font-weight: 400 !important;
    color: #98c379 !important;
  }

  .cm-string,
  .adoc--purple {
    color: #c678dd !important;
    font-style: italic !important;
  }
`;

export default StyledEditor;
