import { red } from '@friends-library/cli-utils/color';
import FsDocPrecursor from '../../fs-precursor/FsDocPrecursor';
import lintPath from '../../lint/lint-path';

export default function validate(dpc: FsDocPrecursor): void {
  // @TODO validate other things:
  //   -> git branch === master
  //   -> git status === clean
  //   -> git HEAD === current with `origin`

  const lints = lintPath(dpc.fullPath);
  if (lints.count() > 0) {
    red(`\n\nERROR: ${lints.count()} lint errors in ${dpc.path} must be fixed. 😬\n\n`);
    process.exit(1);
  }
}
