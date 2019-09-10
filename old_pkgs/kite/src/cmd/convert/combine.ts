export function combineLines(input: string): string {
  return input.replace(/(\.|,|;)\n([^\n])/g, '$1 $2');
}
