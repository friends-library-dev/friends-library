import fs from 'fs';
import { FilePath } from '@friends-library/types';
import { filesFromPath } from '../../lint/path';
import { green } from '@friends-library/cli-utils/color';

interface Argv {
  path: FilePath;
  compare?: FilePath;
  threshold: number;
  write: boolean;
}

export default function handler(argv: Argv): void {
  const pathFiles = filesFromPath(argv.path);
  const map: Map<string, number> = new Map();
  pathFiles.forEach(({ adoc }) => {
    const textLines = adoc
      .split('\n')
      .filter(l => l !== '')
      .filter(l => l !== '--')
      .filter(l => l !== '____')
      .filter(l => !l.match(/^\[.+\]$/))
      .filter(l => !l.includes(']#'))
      .filter(l => l.length > 1)
      .map(l => l.toLowerCase())
      .map(l => l.replace(/footnote:\[/, ''))
      .map(l => l.replace(/=+ /, ''));

    textLines.forEach(line => {
      const words = line
        .replace(/--/g, ' ')
        .replace(/&hellip;/, ' ')
        .split(' ')
        .map(w => w.replace(/^[^a-z]+/, ''))
        .map(w => w.replace(/[^a-z]+$/, ''))
        .map(w => w.replace(/`'s/g, ''))
        .map(w => w.trim())
        .filter(w => w !== '');

      words.forEach(word => {
        if (map.has(word)) {
          map.set(word, (map.get(word) || 0) + 1);
        } else {
          map.set(word, 1);
        }
      });
    });
  });

  const sorted = [...map].sort(([, countA], [, countB]) => {
    if (countA < countB) return -1;
    if (countB < countA) return 1;
    return 0;
  });

  const unusual = sorted.filter(([, count]) => count <= argv.threshold);
  unusual.forEach(([word]) => green(word));

  if (argv.write) {
    fs.writeFileSync(
      `${process.cwd()}/unusual.json`,
      JSON.stringify(
        unusual.map(([word]) => word),
        null,
        2,
      ),
    );
  }
}
