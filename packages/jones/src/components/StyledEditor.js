// @flow
import styled from '@emotion/styled/macro';

const minusSearch = 'calc(30vh - 50px)';

export default styled.div`
  position: relative;
  z-index: 1;
  background: #555;
  width: 100%;
  height: ${p => p.searching ? minusSearch : '100%'};

  .ace_gutter {
    background: #282c34;
    color: #555 !important;
  }

  .ace_editor {
    background: #282c34;
    color: rgb(171, 178, 191);
    font-family: Menlo, Consolas, "DejaVu Sans Mono", monospace;
    width: 100% !important;
    height: ${(p) => p.searching ? minusSearch : '100%'} !important;

    .ace_active-line {
      background: #454545 !important;
    }

    .ace_selection {
      background: blue !important;
    }

    .search-result {
      position: absolute;
      z-index: 20;
      background: green !important;
      opacity: 0.75;
    }
  }

  /* all the ace_* classes below are semantically
     meaningless, I just plugged in random textmate_scope
     keywords when creating my custom asciidoc grammar */

  /* headers */
  .ace_punctuation {
    color: white;
    font-weight: 700;
  }

  /* inline quotes */
  .ace_meta.ace_selector {
    color: #d19a66;
    font-style: italic;
  }

  /* verse/quote brackets */
  .ace_meta.ace_require {
    color: #c678dd;
    font-style: italic;
  }

  /* innerds of verse/quote */
  .ace_invalid.ace_illegal {
    color: #61afef !important;
    font-style: italic;
    background: transparent;
  }

  .ace_quote {
    color: #c678dd;
    font-style: italic;
  }

  /* class bracket open/close [] */
  .ace_punctuation.ace_definition.ace_comment {
    color: white;
    font-weight: 700;
  }

  /* class bracket . and # */
  .ace_meta.ace_tag.string.ace_quoted {
    color: white;
    font-weight: 200;
    opacity: 0.8;
  }

  /* class bracket text */
  .ace_keyword.ace_control {
    color: rgba(171, 178, 191, 0.5);
  }

  /* list asterisk */
  .ace_meta.ace_function-call {
    color: #cc6b73;
  }

  /* footnote (footnote) */
  .ace_markup.ace_raw.ace_inline {
    color #61afef;
  }

  /* footnote (:[) */
  .ace_meta.ace_diff {
    color: rgba(171, 178, 191, 0.5) !important;
  }

  /* footnote text */
  .ace_meta.ace_diff.ace_index {
    color: #98c379 !important;
  }

  /* quote header innerds */
  .ace_invalid {
    font-style: italic;
    color: rgba(171, 178, 191, 0.5) !important;
    background: transparent !important;
  }

  .ace_markup.ace_italic {
    font-style: italic;
    color: #c678dd;
  }

  /* definition list term */
  .ace_markup.ace_heading {
    color: white !important;
    font-size: 700 !important;
  }

  /* definition list colon */
  .ace_markup.ace_raw {
    color: #d19a66;
  }

  /* escape +++ */
  .ace_meta.ace_separator {
    color: #d19a66;
  }

  /* escaped +++[+++ */
  .ace_keyword.ace_other.ace_unit {
    color: #98c379 !important;
  }

  /* open block delimiter */
  .ace_markup.ace_bold {
    color: #61afef !important;
  }

  /* footnote caret ^ */
  .ace_markup.ace_inserted.punctuation {
    color: yellow;
  }

  /* hr ''' */
  .ace_meta.ace_diff.ace_header.ace_from-file {
    color: #61afef !important;
  }
`;
