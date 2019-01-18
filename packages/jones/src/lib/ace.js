// @flow
import type { SearchResult } from '../type';


export function goToSearchResult(result: SearchResult): void {
  const el = document.getElementById('brace-editor');
  if (!el) {
    return;
  }

  try {
    const Range = window.ace.acequire('ace/range').Range;
    const editor = window.ace.edit('brace-editor');
    editor.gotoLine(result.start.line);

    const range = new Range(
      result.start.line - 1,
      result.start.column,
      result.end.line - 1,
      result.end.column,
    );

    editor.scrollToLine(result.start.line - 1, true, true);
    const session = editor.getSession();
    const marker = session.addMarker(range,'search-result', 'text');
    editor.on('focus', () => session.removeMarker(marker));
  } catch (e) {
    // ¯\_(ツ)_/¯
  }
}
