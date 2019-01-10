// @flow
import type { File } from '../redux/type';

type SearchResult = {|
  line: number,
  colStart: number,
  filename: string,
|};

export function searchFiles(
  str: string,
  files: Array<File>,
  _regexp: boolean = false,
  _caseSensitive: boolean = false,
): Array<SearchResult> {
  return files.reduce((results, file) => {
    const lines = (file.editedContent || '').split(/\n/);
    const exp = new RegExp(`\\b${str}\\b`, 'gi');
    lines.forEach((line, index) => {
      let match;
      while ((match = exp.exec(line))) {
        results.push({
          filename: file.filename,
          line: index + 1,
          colStart: match.index,
        });
      }
    });

    return results;
  }, []);
}
