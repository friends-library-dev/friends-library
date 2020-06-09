import { Arguments } from 'yargs';
import { langFromPath } from '../../lint/path';
import lintFixPath from '../../lint/lint-fix-path';
import lintPath from '../../lint/lint-path';
import { printLints } from '../../lint/display';
import { red, green, cyan } from '@friends-library/cli-utils/color';

interface LintCommandOptions {
  path: string;
  rules?: string[];
  exclude?: string[];
  fix: boolean;
  maybe: boolean;
  limit?: number;
}

export default function lintHandler(argv: Arguments<LintCommandOptions>): void {
  const { path, rules, exclude, fix, limit, maybe } = argv;

  const options = {
    maybe,
    lang: langFromPath(path),
    ...(rules ? { include: rules } : {}),
    ...(exclude ? { exclude } : {}),
  };

  if (fix) {
    const { unfixable, numFixed } = lintFixPath(path, options);
    if (unfixable.count() === 0) {
      if (numFixed === 0) {
        green(`0 lint violations found! 😊 \n`);
      } else {
        green(`${numFixed}/${numFixed} lint violations fixed! 😊 \n`);
      }
      process.exit(0);
      return;
    }

    printLints(unfixable, limit || false);
    if (numFixed > 0) {
      cyan(`\n\nFixed ${numFixed} lint violation/s. 👍`);
    }
    red(`Found ${unfixable.count()} un-fixable lint violation/s. 😬 `);
    process.exit(1);
  }

  const lints = lintPath(path, options);
  if (lints.count() === 0) {
    green(`0 lint violations found! 😊 \n`);
    process.exit(0);
  }

  printLints(lints, limit || false);
  const numFixable = lints.numFixable();
  red(`\n\nFound ${lints.count()} lint violation/s. 😬 `);
  if (numFixable > 0) {
    red(`${numFixable} are fixable with --fix. 👍`);
  }
  process.exit(1);
}
