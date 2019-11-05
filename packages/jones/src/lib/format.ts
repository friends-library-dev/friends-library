export interface Range {
  start: {
    row: number;
    column: number;
  };
  end: {
    row: number;
    column: number;
  };
}

export function italicize(
  selection: string,
  firstLine: string,
  lastLine: string,
  range: Range,
): string {
  const {
    start: { column: startCol },
    end: { column: endCol },
  } = range;
  const before = firstLine[startCol - 1] || '';
  const after = lastLine[endCol] || '';
  const symbol = dunder(before) || dunder(after) ? '__' : '_';
  return `${symbol}${selection}${symbol}`;
}

function dunder(char: string): boolean {
  return !!char.match(/[A-Z`^]/i);
}
