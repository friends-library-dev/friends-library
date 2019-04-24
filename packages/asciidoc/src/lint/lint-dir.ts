import { FilePath, LintOptions } from '@friends-library/types';
import lint from './lint';
import DirLints from './dir-lints';
import filesFromPath from './files-from-path';

export default function lintPath(
  path: FilePath,
  options: LintOptions = { lang: 'en' },
): DirLints {
  const files = filesFromPath(path);
  const lints = new DirLints();
  files.forEach(file =>
    lints.set(file.path, {
      lints: lint(file.adoc, options),
      adoc: file.adoc,
    }),
  );
  return lints;
}
