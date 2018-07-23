// @flow

export function prepareAsciidoc(raw: string): string {
  return raw
    .replace(/\^\nfootnote:\[/igm, 'footnote:[')
    .replace(/"`/igm, '“')
    .replace(/`"/igm, '”')
    .replace(/'`/igm, '‘')
    .replace(/`'/igm, '’');
}
