import { LintOptions, EditionType } from '@friends-library/types';
import { LANG } from './github-api';

export function lintOptions(path: string): LintOptions {
  let editionType: EditionType = 'original';
  if (path.includes('/modernized/')) {
    editionType = 'modernized';
  } else if (path.includes('/updated/')) {
    editionType = 'updated';
  }
  return { lang: LANG, editionType };
}
