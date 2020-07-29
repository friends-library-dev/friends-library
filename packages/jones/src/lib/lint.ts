import { LintOptions, EditionType } from '@friends-library/types';
import { LANG } from './github-api';

export function lintOptions(path: string): LintOptions {
  let editionType: EditionType = `original`;
  if (path.includes(`/modernized/`)) {
    editionType = `modernized`;
  } else if (path.includes(`/updated/`)) {
    editionType = `updated`;
  }
  return { lang: LANG, editionType };
}

export function editorSubsetLintOptions(path: string): LintOptions {
  const options = lintOptions(path);
  options.exclude = [
    `am-pm`,
    `capitalize`,
    `consecutive-spaces`,
    `consistent-name-spelling`,
    `eof-newline`,
    `git-conflict-markers`,
    `initials-comma`,
    `join-words`,
    `leading-whitespace`,
    `libre-office-artifacts`,
    `mid-word-non-letter`,
    `mid-word-uppercase`,
    `modernize-words`,
    `multiple-blank-lines`,
    `no-undefined`,
    `obsolete-spellings`,
    `person-mismatch`,
    `scan-errors`,
    `title-length`,
    `trailing-whitespace`,
    `unexpected-period`,
    `unhyphened-words`,
  ];
  return options;
}
