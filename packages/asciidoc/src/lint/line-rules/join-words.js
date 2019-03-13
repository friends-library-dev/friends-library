// @flow
import type { Asciidoc, LintResult } from '../../../../../type';

export default function rule(
  line: Asciidoc,
  lines: Array<Asciidoc>,
  lineNumber: number,
): Array<LintResult> {
  if (line === '') {
    return [];
  }

  // @see https://books.google.com/ngrams for data backing up choices
  const sets = [
    ['every', 'where', ''],
    ['every', 'thing', ''],
    ['tender', 'spirited', '-'],
    ['hard', 'hearted', '-'],
    ['hard', 'heartedness', '-'],
    ['honest', 'hearted', '-'],
    ['simple', 'hearted', '-'],
    ['faint', 'hearted', ''],
    ['upright', 'hearted', '-'],
    ['sincere', 'hearted', '-'],
    ['tender', 'hearted', '-'],
    ['tender', 'heartedness', '-'],
    ['stout', 'hearted', '-'],
    ['broken', 'hearted', ''],
    ['humble', 'hearted', '-'],
    ['true', 'hearted', '-'],
    ['heavy', 'hearted', '-'],
    ['dead', 'hearted', '-'],
    ['open', 'hearted', '-'],
    ['single', 'hearted', '-'],
    ['light', 'hearted', ''],
    ['fellow', 'laborers', '-'],
    ['fellow', 'labourers', '-'],
    ['fellow', 'laborer', '-'],
    ['fellow', 'labourer', '-'],
    ['fore', 'part', ''],
  ];

  const results = [];
  sets.forEach(([first, second, joiner]) => {
    if (!line.match(new RegExp(`\\b${first}\\b`, 'i'))) {
      return;
    }

    const sameLine = new RegExp(`\\b(${first})( )(${second})\\b`, 'i');
    const match = line.match(sameLine);
    if (match) {
      results.push(getLint(
        lineNumber,
        match.index + 1 + first.length,
        first,
        second,
        joiner,
        line.replace(sameLine, `$1${joiner}$3`),
      ));
      return;
    }

    const nextLine = lines[lineNumber];
    if (!nextLine || nextLine.indexOf(second) !== 0) {
      return;
    }

    const nextLineStart = new RegExp(`^(${second})\\b`);
    if (!nextLine.match(nextLineStart)) {
      return;
    }

    const thisLineEnd = new RegExp(`\\b(${first})$`, 'i');
    const lineEndMatch = line.match(thisLineEnd);
    if (!lineEndMatch) {
      return;
    }

    let reco;
    if (line.length < nextLine.length) {
      reco = `${line}${joiner}${second}\n${nextLine.replace(nextLineStart, '').trim()}`;
    } else {
      reco = `${line.replace(thisLineEnd, '').trim()}\n${lineEndMatch[1]}${joiner}${nextLine}`;
    }

    results.push(getLint(
      lineNumber,
      lineEndMatch.index + 1,
      first,
      second,
      joiner,
      reco,
    ));
  });

  return results;
}

rule.slug = 'join-words';

function getLint(
  line: number,
  column: number,
  first: string,
  second: string,
  joiner: string,
  recommendation: string,
): LintResult {
  return {
    line,
    column,
    type: 'error',
    rule: rule.slug,
    message: `"${first} ${second}" should be combined to become "${first}${joiner}${second}"`,
    fixable: true,
    recommendation,
  };
}
