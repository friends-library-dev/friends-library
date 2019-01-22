// @flow
import type { SearchResult } from '../type';
import defer from 'lodash/defer';

type AceMarker = {|
  id: number,
  clazz: string,
|};

function getEditor() {
  const el = document.getElementById('brace-editor');
  if (!el) {
    return;
  }

  try {
    const editor = window.ace.edit('brace-editor');
    if (editor) {
      return editor;
    }
  } catch (e) {
    // ¯\_(ツ)_/¯
  }

  return null;
}

export function clearSearchResultHighlights(): void {
  const editor = getEditor();
  if (!editor) {
    return;
  }

  try {
    const session = editor.getSession();
    Object.values(session.getMarkers()).forEach(m => {
      const marker = ((m: any): AceMarker);
      if (marker.clazz === 'search-result') {
        session.removeMarker(marker.id);
      }
    });
  } catch (e) {
    // ¯\_(ツ)_/¯
  }
}

export function goToSearchResult(
  result: SearchResult,
  replace: ?string = null,
): void {
  // defer to allow ace to re-init
  defer(() => {
    try {
      const editor = getEditor();
      if (!editor) {
        return;
      }

      const session = editor.getSession();
      const Range = window.ace.acequire('ace/range').Range;
      editor.gotoLine(result.start.line);

      const endCol = replace
        ? result.start.column + replace.length
        : result.end.column;

      const range = new Range(
        result.start.line - 1,
        result.start.column,
        result.end.line - 1,
        endCol,
      );

      editor.scrollToLine(result.start.line - 1, true, true);

      clearSearchResultHighlights();

      // highlight selected search result
      const marker = session.addMarker(range,'search-result', 'text');
      editor.on('focus', () => session.removeMarker(marker));
    } catch (e) {
      // ¯\_(ツ)_/¯
    }
  });
}
