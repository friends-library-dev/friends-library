import { find } from '@friends-library/hilkiah';
import memoize from 'lodash/memoize';

const NEWLINE = '__NEWLINE__';

const splitByPunctuation = (maxLen: number) => {
  return (acc: any, part: string): any => {
    const lastIndex = acc.length - 1;
    const lastLine = acc[lastIndex];
    if (lastLine === '') {
      acc[lastIndex] = part;
    } else if (`${lastLine} ${part}`.length < maxLen) {
      acc[lastIndex] = `${lastLine} ${part}`;
    } else {
      acc.push(part);
    }
    return acc;
  };
};

function scoreForceSplit(arr: Array<string>, minLen: number, maxLen: number): number {
  let score = 0;
  let prev: string;
  arr.forEach(part => {
    score += maxLen - part.length;
    if (part.length < minLen) {
      score += 20;
    }

    // prevent splitting on opening/closing parens
    if (part.match(/ \($/) || part.match(/^\)/)) {
      score += 200;
    }

    // prevent splitting before/after smart quote open
    if (part.match(/(--| )("|')`$/) || part.match(/^`("|')/)) {
      score += 200;
    }

    if (prev) {
      score += Math.abs(part.length - prev.length);

      // prevent splitting between double-dash
      if (part.match(/^-/) && prev.match(/-$/)) {
        score += 200;
      }

      // prevent splitting inside smart quote open
      if (prev.match(/("|')$/) && part.match(/^`/)) {
        score += 200;
      }

      // prevent splitting inside smart quote close
      if (prev.match(/`$/) && part.match(/^("|')/)) {
        score += 200;
      }
    }
    prev = part;
  });
  return score;
}

function forceSplit(maxLen: number, minLen: number): any {
  return (acc: Array<string>, part: string): any => {
    if (part.length < maxLen) {
      return acc.concat([part]);
    }

    let match;
    let best = [''];
    let bestScore = 100000;
    let current;
    let currentScore;
    let splitLen = maxLen - 7;

    while (splitLen >= minLen) {
      const regex = new RegExp(`.{1,${splitLen}}\\W`, 'g');
      current = [];
      while ((match = regex.exec(part))) {
        current.push(match[0].trim());
      }

      currentScore = scoreForceSplit(current, minLen, maxLen);
      if (currentScore < bestScore) {
        best = current;
        bestScore = currentScore;
      }
      splitLen -= 7;
    }
    return acc.concat(best);
  };
}

function cleanup(lines: Array<string>, line: string, index: number): Array<string> {
  // this fixes lines like ^Oh,$
  if (lines[index - 1] && lines[index - 1].match(/^[A-Z][a-z]{1,3},$/)) {
    lines[index - 1] = `${lines[index - 1]} ${line}`;
    // this fixes lines that are just ^etc.$
  } else if (line === 'etc.' && index > 0) {
    lines[index - 1] = `${lines[index - 1]} etc.`;
  } else if (getLeadingRef(line) && index) {
    const pos = getLeadingRef(line) || 0;
    const ref = line.substring(0, pos);
    const rest = line.substring(pos).trim();
    lines[index - 1] = `${lines[index - 1]} ${ref}`;
    lines.push(rest);
  } else {
    lines.push(line);
  }
  return lines;
}

const getLeadingRef = memoize(
  (line: string): number | null => {
    if (line.match(/verse [0-9]+\./)) {
      return line.indexOf('.') + 1;
    }

    // catch refs in their "mutated" state
    if (line.match(/^((1|2) )?[A-Z][a-z]+({•})? [0-9]{1,2}{\^}[0-9,-]+\./)) {
      return line.indexOf('.') + 1;
    }

    const refs = find(line);

    if (refs.length === 0 || refs[0].position.start !== 0) {
      return null;
    }

    if (line[refs[0].position.end] === '.') {
      return line.indexOf('.') + 1;
    }

    return null;
  },
);

export function makeSplitLines(maxLen: number, minLen: number): any {
  return (input: string): string => {
    const split = input
      .replace(/footnote:\[/gm, '^\nfootnote:[')
      .replace(/\] /gm, ']\n')
      .replace(
        /((?:[A-Za-z)]{3}| [a-z)]{2}| 1[678][0-9]{2}))(\.|\?)(`"|')? (.)/gm,
        (full, a, b, c, d) => {
          if (a === 'viz') {
            return full;
          }
          if (a === 'ver' && b === '.' && d.match(/\d/)) {
            return full;
          }
          if (a === 'etc' && d.match(/[a-z]/)) {
            return full;
          }
          return `${a}${b}${c || ''}${NEWLINE}${d}`;
        },
      )
      .replace(/([A-Za-z]{2})!(`")? ([A-Z])/gm, `$1!$2${NEWLINE}$3`)
      .split(NEWLINE)
      .join('\n')
      .split('\n')
      .map(line => {
        if (line.length <= maxLen || (line[0] && line[0] === '=')) {
          return line;
        }

        const parts = line.replace(/([,|;|:]) /gm, '$1\n').split('\n');

        return parts
          .reduce(splitByPunctuation(maxLen), [''])
          .reduce(forceSplit(maxLen, minLen), [])
          .reduce(cleanup, [])
          .join('\n');
      })
      .reduce(cleanup, [])
      .join('\n');
    return fixFootnoteSplitters(split);
  };
}

export const splitLines: (input: string) => string = makeSplitLines(90, 45);

function fixFootnoteSplitters(input: string): string {
  return input
    .replace(
      /{(\n)?footnote(\n)?-(\n)?paragraph(\n)?-(\n)?split(\n)?}/gm,
      '\n{footnote-paragraph-split}\n',
    )
    .replace(/\n+{footnote-paragraph-split}\n+/gm, '\n{footnote-paragraph-split}\n');
}

export function refUnmutate(str: string): string {
  return str.replace(/{•}/gm, '.').replace(/{\^}/gm, ':');
}

export function refMutate(str: string): string {
  return str.replace(/\./gm, '{•}').replace(/:/gm, '{^}');
}
