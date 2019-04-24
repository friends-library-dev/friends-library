import { LintOptions, EditionType } from '@friends-library/types';

export function lintOptions(path: string): LintOptions {
  let editionType: EditionType = 'original';
  if (path.includes('/modernized/')) {
    editionType = 'modernized';
  } else if (path.includes('/updated/')) {
    editionType = 'updated';
  }
  return { lang: 'en', editionType };
}
