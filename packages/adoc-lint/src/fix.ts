import { Asciidoc, LintResult, LintOptions } from '@friends-library/types';
import lint from './lint';
import singlePassFix from './fix-single-pass';

export default function fix(
  adoc: Asciidoc,
  options: LintOptions = { lang: `en` },
): {
  fixed: Asciidoc;
  numFixed: number;
  unfixable: LintResult[];
} {
  const lints = lint(adoc, options);
  const fixable = lints.filter(l => l.fixable === true);
  const unfixable = lints.filter(l => l.fixable !== true);
  if (fixable.length === 0) {
    return { fixed: adoc, numFixed: 0, unfixable };
  }

  let fixed = adoc;
  let remainingUnfixed = fixable.length;
  let remainingLints = lints;
  while (remainingUnfixed > 0) {
    [fixed, remainingUnfixed] = singlePassFix(fixed, remainingLints);
    if (remainingUnfixed > 0) {
      remainingLints = lint(fixed, options);
    }
  }

  return {
    fixed,
    unfixable,
    numFixed: fixable.length,
  };
}
