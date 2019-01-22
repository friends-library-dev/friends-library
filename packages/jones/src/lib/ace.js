// @flow
import type { SearchResult } from '../type';
import defer from 'lodash/defer';

type AceMarker = {|
  id: number,
  clazz: string,
|};

export function goToSearchResult(
  result: SearchResult,
  replace: ?string = null,
): void {
  // defer to allow ace to re-init
  defer(() => {
    const el = document.getElementById('brace-editor');
    if (!el) {
      return;
    }

    try {
      const Range = window.ace.acequire('ace/range').Range;
      const editor = window.ace.edit('brace-editor');
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
      const session = editor.getSession();

      // clear out any previous search result markers
      Object.values(session.getMarkers()).forEach(m => {
        const marker = ((m: any): AceMarker);
        if (marker.clazz === 'search-result') {
          session.removeMarker(marker.id);
        }
      });

      // highlight selected search result
      const marker = session.addMarker(range,'search-result', 'text');
      editor.on('focus', () => session.removeMarker(marker));
    } catch (e) {
      // ¯\_(ツ)_/¯
    }
  });
}
