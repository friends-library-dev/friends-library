import { Asciidoc, LintResult } from '@friends-library/types';
import escape from 'escape-string-regexp';

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
  ['for', 'ever', ''],
  ['for', 'evermore', ''],
  ['like', 'minded', '-'],
  ['feeble', 'minded', '-'],
  ['high', 'minded', '-'],
  ['honest', 'minded', '-'],
  ['humble', 'minded', '-'],
  ['tender', 'minded', '-'],
  ['well', 'minded', '-'],
  ['right', 'minded', '-'],
  ['carnal', 'minded', '-'],
  ['heavenly', 'minded', '-'],
  ['earthly', 'minded', '-'],
  ['lowly', 'minded', '-'],
  ['simple', 'minded', '-'],
  ['better', 'minded', '-'],
  ['religious', 'minded', '-'],
  ['upright', 'minded', '-'],
  ['liberal', 'minded', '-'],
  ['sober', 'minded', '-'],
  ['evil', 'minded', '-'],
  ['worldly', 'minded', '-'],
  ['noble', 'minded', '-'],
  ['single', 'minded', '-'],
  ['open', 'minded', '-'],
];

const firstParts = new RegExp(
  `\\b${sets.map(([first]) => escape(first)).join('|')}\\b`,
  'i',
);

export default function rule(
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] {
  if (line === '') {
    return [];
  }

  if (!line.match(firstParts)) {
    return [];
  }

  const results: LintResult[] = [];
  sets.forEach(([first, second, joiner]) => {
    if (!line.match(new RegExp(`\\b${first}\\b`, 'i'))) {
      return;
    }

    const sameLine = new RegExp(`\\b(${first})( )(${second})\\b`, 'i');
    const match = line.match(sameLine);
    if (match && match.index !== undefined) {
      results.push(
        getLint(
          lineNumber,
          match.index + 1 + first.length,
          first,
          second,
          joiner,
          line.replace(sameLine, `$1${joiner}$3`),
        ),
      );
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
    if (!lineEndMatch || typeof lineEndMatch.index === 'undefined') {
      return;
    }

    let reco;
    if (line.length < nextLine.length) {
      reco = `${line}${joiner}${second}\n${nextLine.replace(nextLineStart, '').trim()}`;
    } else {
      reco = `${line.replace(thisLineEnd, '').trim()}\n${
        lineEndMatch[1]
      }${joiner}${nextLine}`;
    }

    results.push(
      getLint(lineNumber, lineEndMatch.index + 1, first, second, joiner, reco),
    );
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
