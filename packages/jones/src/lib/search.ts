import escape from 'escape-string-regexp';
import { File, SearchResult } from '../type';

export function searchFiles(
  searchTerm: string,
  files: File[],
  words: boolean = true,
  caseSensitive: boolean = false,
  regexp: boolean = false,
): SearchResult[] {
  const results = files.reduce(
    (acc, file) => {
      const lines = (file.editedContent || file.content || '').split(/\n/);
      let pattern = regexp ? searchTerm : escape(searchTerm);
      if (words) {
        pattern = `\\b${pattern}\\b`;
      }

      let exp: RegExp;
      try {
        exp = new RegExp(pattern, `g${caseSensitive ? '' : 'i'}`);
      } catch {
        return [];
      }

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
              column: match.index + searchTerm.length,
            },
          };
          acc.push({
            ...result,
            context: getContext(result, lines),
          });
        }
      });
      return acc;
    },
    [] as SearchResult[],
  );
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

function getContext(
  result: Omit<SearchResult, 'context'>,
  lines: string[],
): { lineNumber: number; content: string }[] {
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
  if (lines[afterLineIndex] && lines[afterLineIndex].trim()) {
    context.push({
      lineNumber: afterLineIndex + 1,
      content: lines[afterLineIndex],
    });
  }

  return context;
}
