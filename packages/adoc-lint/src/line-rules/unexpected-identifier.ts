import { Asciidoc, LintResult } from '@friends-library/types';
import { LineRule } from '../types';
import { isAsciidocBracketLine } from '../utils';

const rule: LineRule = (
  line: Asciidoc,
  lines: Asciidoc[],
  lineNumber: number,
): LintResult[] => {
  if (line === `` || !isAsciidocBracketLine(line)) {
    return [];
  }

  const identifiers = line
    .replace(/^\[(.+)\]$/, `$1`)
    .replace(/cols="([0-9,])+"/, ``)
    .replace(/,.*/, ``)
    .replace(/^#[\w\d-_]+/, ``)
    .trim();

  if (!identifiers) {
    return [];
  }

  if (KEYWORDS.includes(identifiers)) {
    return [];
  }

  if (identifiers.startsWith(`quote.`)) {
    const rest = identifiers.replace(/^quote\./, ``);
    if (![`scripture`, `epigraph`].includes(rest)) {
      return [violation(lineNumber, identifiers, [`quote.scripture`, `quote.epigraph`])];
    }
    return [];
  }

  if (CLASSES.includes(identifiers)) {
    return [violation(lineNumber, identifiers, [`.${identifiers}`])];
  }

  if (CLASSES.includes(identifiers.replace(/^\./, ``))) {
    return [];
  }

  if (identifiers.split(`.`).length > 2) {
    const expr = /\.([^.#]+)/g;
    let match: RegExpExecArray | null = null;
    while ((match = expr.exec(identifiers))) {
      if (!CLASSES.includes(match[1])) {
        return [violation(lineNumber, match[1], [])];
      }
    }
    return [];
  }

  return [violation(lineNumber, identifiers, [])];
};

rule.slug = `unexpected-identifier`;

export default rule;

const KEYWORDS = [`verse`, `quote`, `discrete`];
const CLASSES = [
  `no-indent`,
  `emphasized`,
  `centered`,
  `alt`,
  `blurb`,
  `asterism`,
  `small-break`,
  `old-style`,
  `letter-heading`,
  `offset`,
  `salutation`,
  `division`,
  `discourse-part`,
  `signed-section-signature`,
  `signed-section-context-open`,
  `signed-section-closing`,
  `signed-section-context-close`,
  `numbered`,
  `bold`,
  `weight-normal`,
  `small-caps`,
  `intermediate-title`,
  `style-blurb`,
  `numbered-group`,
  `chapter-synopsis`,
  `embedded-content-document`,
  `embedded-content-document.letter`,
  `embedded-content-document.epistle`,
  `embedded-content-document.address`,
  `embedded-content-document.testimony`,
  `embedded-content-document.paper`,
  `embedded-content-document.prayer`,
  `embedded-content-document.legal`,
  `embedded-content-document.treatise`,
  `embedded-content-document.minute`,
  `chapter-subtitle--blurb`,
  `postscript`,
  `syllogism`,
  `table-valign-middle`,
  `table-vertical-lines`,
  `table-align-center`,
  `table-header-tail-x-small`,
  `table-last-col-secondary`,
  `table-tail-align-right`,
  `table-tail-align-center`,
  `the-end`,
];

function violation(
  lineNumber: number,
  identifier: string,
  possibly: string[],
): LintResult {
  let message = `"${identifier}" is not a known identifier`;
  if (possibly.length) {
    message += `, did you mean "${possibly.join(`", "`)}"?`;
  }

  return {
    line: lineNumber,
    column: 2,
    type: `error`,
    rule: rule.slug,
    message,
  };
}
