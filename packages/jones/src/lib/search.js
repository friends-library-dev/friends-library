// @flow
import type { File, SearchResult } from '../type';

export function searchFiles(
  str: string,
  files: Array<File>,
  _regexp: boolean = false,
  _caseSensitive: boolean = false,
): Array<SearchResult> {
  const results = files.reduce((acc, file) => {
    const lines = (file.editedContent || file.content || '').split(/\n/);
    const exp = new RegExp(`\\b${str}\\b`, 'gi');
    lines.forEach((line, index) => {
      let match;
      while ((match = exp.exec(line))) {
        const [documentSlug, editionType, filename] = file.path.split('/');
        const result = {
          path: file.path,
          documentSlug,
          editionType,
          filename,
          start: {
            line: index + 1,
            column: match.index,
          },
          end: {
            line: index + 1,
            column: match.index + str.length,
          },
        };
        acc.push({
          ...result,
          context: getContext(result, lines),
        });
      }
    });
    return acc;
  }, []);
  return results.sort(({ editionType }) => {
    switch (editionType) {
      case 'updated':
        return -1;
      case 'modernized':
        return 0;
      default:
        return 1;
    }
  });
}

function getContext(result, lines) {
  const context = [];
  const { start, end } = result;

  const beforeLineIndex = start.line - 2;
  if (beforeLineIndex > -1 && lines[beforeLineIndex].trim()) {
    context.push({
      lineNumber: beforeLineIndex + 1,
      content: lines[beforeLineIndex],
    });
  }

  const resultLines = end.line - start.line + 1;
  for (let i = 1; i <= resultLines; i++) {
    context.push({
      lineNumber: start.line + (i - 1),
      content: lines[start.line + (i - 2)],
    });
  }

  const afterLineIndex = end.line;
  if (afterLineIndex <= lines.length && lines[afterLineIndex].trim()) {
    context.push({
      lineNumber: afterLineIndex + 1,
      content: lines[afterLineIndex],
    });
  }

  return context;
}
