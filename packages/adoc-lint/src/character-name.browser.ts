export default function characterName(char: string): string {
  // I don't know how to code in a soft-hyphen,
  // so there's one embedded in this string
  if (char === 'be­stowed'[2]) {
    return 'SOFT HYPHEN';
  }

  switch (char) {
    case '–':
      return 'EN DASH';
    case '•':
      return 'BULLET';
    case 'О':
      return 'CYRILLIC CAPITAL LETTER O';
    case '“':
      return 'LEFT DOUBLE QUOTATION MARK';
    case '”':
      return 'RIGHT DOUBLE QUOTATION MARK';
    case '‘':
      return 'LEFT SINGLE QUOTATION MARK';
    case '’':
      return 'RIGHT SINGLE QUOTATION MARK';
    case ' ':
      return 'NO-BREAK SPACE';
    default:
      return 'UNKNOWN';
  }
}
