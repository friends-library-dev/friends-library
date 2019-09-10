import DocumentMeta from '.';
import chalk from 'chalk';
import { PrintSize as Size } from '@friends-library/types';

type Multipliers = { [k in Size]: number };

let multipliers: Multipliers | undefined;

export default function estimatePages(
  meta: DocumentMeta,
  adocLength: number,
  numSections: number,
  size: Size,
): number {
  if ([...meta].length === 0) {
    throw new Error('Meta must be loaded to estimate pages!');
  }

  if (!multipliers) {
    multipliers = calculateMultipliers(meta);
  }

  return estimateWithMultipliers(adocLength, numSections, size, multipliers);
}

function calculateMultipliers(meta: DocumentMeta): Multipliers {
  const tweaks: Multipliers = { s: 1.05, m: 1.05, xl: 1.05 };
  const doneTweaking: { [k in Size]: boolean } = {
    s: false,
    m: false,
    xl: false,
  };

  const docMultipliers: { [k in Size]: number[] } = { s: [], m: [], xl: [] };
  for (const [, { pages, adocLength, numSections }] of meta) {
    const chapOffset = (numSections - 1) * CHAPTER_MULTIPLIER;
    if (adocLength < SMALL_UPPER_THRESHOLD) {
      docMultipliers.s.push((pages.s - chapOffset) / adocLength);
    }
    if (adocLength > MEDIUM_LOWER_THRESHOLD && adocLength < MEDIUM_UPPER_THRESHOLD) {
      docMultipliers.m.push(pages.m / adocLength);
    }
    if (adocLength > LARGE_LOWER_THRESHOLD) {
      docMultipliers.xl.push(pages.xl / adocLength);
    }
  }

  const untweaked: Multipliers = {
    s: docMultipliers.s.reduce(add) / docMultipliers.s.length,
    m: docMultipliers.m.reduce(add) / docMultipliers.m.length,
    xl: docMultipliers.xl.reduce(add) / docMultipliers.xl.length,
  };

  let tweaked = untweaked;
  const step = 0.00001;

  while (Object.values(doneTweaking).includes(false)) {
    sizes.forEach(size => {
      if (doneTweaking[size] === true) return;
      tweaks[size] = tweaks[size] - step;
    });

    tweaked = {
      s: untweaked.s * tweaks.s,
      m: untweaked.m * tweaks.m,
      xl: untweaked.xl * tweaks.xl,
    };

    const delta: { [k in Size]: number } = { s: 0, m: 0, xl: 0 };
    for (const [, { pages, adocLength, numSections }] of meta) {
      for (const size of sizes) {
        if (sizeApproximatelyMatchesLength(size, adocLength)) {
          const guess = estimateWithMultipliers(adocLength, numSections, size, tweaked);
          delta[size] = delta[size] + (guess - pages[size]);
        }
      }
    }

    for (const size of sizes) {
      if (delta[size] < 0) {
        doneTweaking[size] = true;
        tweaked[size] = untweaked[size] * (tweaks[size] + step);
      }
    }
  }

  if (process && process.argv.includes('--verbose')) {
    printAllBookGuesses(meta, tweaked);
  }

  return tweaked;
}

function sizeApproximatelyMatchesLength(size: Size, adocLength: number): boolean {
  switch (size) {
    case 's':
      return adocLength < SMALL_UPPER_THRESHOLD;
    case 'm':
      return adocLength > MEDIUM_LOWER_THRESHOLD && adocLength < MEDIUM_UPPER_THRESHOLD;
    case 'xl':
      return adocLength > LARGE_LOWER_THRESHOLD;
  }
}

function estimateWithMultipliers(
  adocLength: number,
  numSections: number,
  size: Size,
  multipliers: Multipliers,
): number {
  return Math.ceil(
    adocLength * multipliers[size] + (numSections - 1) * CHAPTER_MULTIPLIER,
  );
}

const sizes: Size[] = ['s', 'm', 'xl'];
const CHAPTER_MULTIPLIER = 1;
const SMALL_UPPER_THRESHOLD = 185000;
const MEDIUM_LOWER_THRESHOLD = 160000;
const MEDIUM_UPPER_THRESHOLD = 950000;
const LARGE_LOWER_THRESHOLD = 850000;

function add(a: number, b: number): number {
  return a + b;
}

function printAllBookGuesses(meta: DocumentMeta, tweaked: Multipliers): void {
  console.log(chalk.dim('\nsize  guess   actual  delta   path'));
  console.log(chalk.dim(''.padEnd(102, '-')));
  for (const [id, { pages, adocLength, numSections }] of meta) {
    sizes.forEach(size => {
      if (sizeApproximatelyMatchesLength(size, adocLength)) {
        const guess = estimateWithMultipliers(adocLength, numSections, size, tweaked);
        let sizeStr = chalk.yellow('L');
        if (size === 's') {
          sizeStr = chalk.cyan('S');
        } else if (size === 'm') {
          sizeStr = chalk.magenta('M');
        }
        console.log(
          `  ${sizeStr}:   ${`${String(guess).padEnd(6, ' ')} ${chalk.dim(
            `(${pages[size]})`.padEnd(8, ' '),
          )}`} ${chalk[guess < pages[size] ? 'red' : 'green'](
            (guess < pages[size] ? '-' : '+') +
              String(Math.abs(guess - pages[size])).padEnd(5, ' '),
          )} ${chalk.gray(id)}`,
        );
      }
    });
  }
  console.log(chalk.dim(''.padEnd(102, '-')));
  console.log(chalk.dim('size  guess   actual  delta   path\n'));
}
