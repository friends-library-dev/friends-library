import { Asciidoc, LintResult } from '@friends-library/types';

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '' || line[line.length - 1] !== '-' || line[line.length - 2] === '-') {
    return [];
  }

  // footnote poetry stanza marker
  if (line.indexOf('     - - - -') === 0) {
    return [];
  }

  const recommendation = getRecommendation(line, lines[lineNumber]);

  return [
    {
      line: lineNumber,
      column: line.length,
      type: 'error',
      rule: rule.slug,
      message: 'Lines may not end with a hyphen',
      ...(recommendation === false ? {} : { recommendation, fixable: true }),
    },
  ];
}

function getRecommendation(line: Asciidoc, next: Asciidoc | null): string | false {
  if (!next) {
    return false;
  }

  if (!line.includes(' ') || !next.includes(' ')) {
    return false;
  }

  if (next.indexOf('//') === 0 || next[0] === '-') {
    return false;
  }

  if (line.length <= next.length) {
    const nextWords = next.split(' ');
    const nextFirst = nextWords.shift();
    return `${line}${nextFirst}\n${nextWords.join(' ')}`;
  }

  const lineWords = line.split(' ');
  const lineLast = lineWords.pop();
  return `${lineWords.join(' ')}\n${lineLast}${next}`;
}

rule.slug = 'trailing-hyphen';
