import { find } from '@friends-library/hilkiah';
import memoize from 'lodash/memoize';

export function makeSplitLines(
  maxLen: number,
  minLen: number,
): (input: string) => string {
  return (input: string): string => {
    const sentences = splitIntoSentences(input);
    const validLines = sentences
      .map(sentence => {
        if (sentence.length <= maxLen || lineIsHeading(sentence)) {
          return sentence;
        }
        return splitSentence(sentence, maxLen, minLen);
      })
      .reduce(cleanup, [])
      .join('\n');
    return fixFootnoteSplitters(validLines);
  };
}

export const splitLines: (input: string) => string = makeSplitLines(90, 45);

function splitIntoSentences(input: string): string[] {
  const splitSentencesRegExp = regex.assemble(
    [
      // last word before sentence-ending `.` or `,`
      /(?<lastWord>[A-Za-z)]{3}| [a-z)]{2}| 1[678][0-9]{2})/,
      // sentence-ending `.` or `,`
      /(?<punctuation>\.|\?)/,
      // optional close quote/apostrophe
      /(?<trailingQuote>`"|')?/,
      // followed by a required space
      ' ',
      // capture whatever the next character is for ruling out certain things
      /(?<nextCharacter>.)/,
    ],
    'gm',
  );

  return input
    .replace(/footnote:\[/gm, '^\nfootnote:[')
    .replace(/\] /gm, ']\n')
    .replace(
      splitSentencesRegExp,
      regex.groupsFirst((groups, match) => {
        const { lastWord, punctuation, trailingQuote = '', nextCharacter } = groups;
        if (lastWord === 'viz') {
          return match;
        }
        if (lastWord === 'ver' && punctuation === '.' && nextCharacter.match(/\d/)) {
          return match;
        }
        if (lastWord === 'etc' && nextCharacter.match(/[a-z]/)) {
          return match;
        }
        return `${lastWord}${punctuation}${trailingQuote}${NEWLINE}${nextCharacter}`;
      }),
    )
    .replace(/([A-Za-z]{2})!(`")? ([A-Z])/gm, `$1!$2${NEWLINE}$3`)
    .split(NEWLINE)
    .join('\n')
    .split('\n');
}

function splitSentence(sentence: string, maxLen: number, minLen: number): string {
  // first, split into phrases on all comma, semicolon, and colon
  let lines = splitByPunctuation(sentence);

  // next re-join short phrases to keep lines close ideal length
  lines = lines.reduce(rejoinShortPhrases(maxLen), ['']);

  // if we still have lines that are too long, split between words (without punctuation)
  lines = lines.reduce(splitBetweenWords(maxLen, minLen), []);

  // clean up and return as a single string including newlines
  return lines.reduce(cleanup, []).join('\n');
}

function splitByPunctuation(sentence: string): string[] {
  return sentence.replace(/([,|;|:]) /gm, '$1\n').split('\n');
}

const rejoinShortPhrases: (
  maxLen: number,
) => (acc: string[], part: string) => string[] = maxLen => {
  return (acc, part) => {
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

function splitBetweenWords(
  maxLen: number,
  minLen: number,
): (acc: string[], part: string) => string[] {
  return (acc: string[], part: string): string[] => {
    if (part.length < maxLen) {
      return acc.concat([part]);
    }

    let best = [''];
    let bestScore = 100000;
    let current;
    let currentScore;
    let splitLen = maxLen - 7;
    const words = part.split(' ');

    while (splitLen >= minLen) {
      current = getWordSplitCandidate(words, splitLen);
      currentScore = scoreSplitBetweenWords(current, minLen, maxLen);
      if (currentScore < bestScore) {
        best = current;
        bestScore = currentScore;
      }
      splitLen -= 7;
    }

    return acc.concat(best);
  };
}

function getWordSplitCandidate(words: string[], splitLen: number): string[] {
  let chunks: string[][] = [[]];
  let lineIndex = 0;
  words.forEach(word => {
    if (chunks[lineIndex].join(' ').length < splitLen) {
      chunks[lineIndex].push(word);
      return;
    }
    lineIndex++;
    chunks[lineIndex] = [word];
  });
  return chunks.map(chunk => chunk.join(' '));
}

function scoreSplitBetweenWords(arr: string[], minLen: number, maxLen: number): number {
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

function cleanup(lines: string[], line: string, index: number): string[] {
  // this fixes lines like ^Oh,$
  if (lines[index - 1] && lines[index - 1].match(/^[A-Z][a-z]{1,3},$/)) {
    lines[index - 1] = `${lines[index - 1]} ${line}`;
    return lines;
  }

  // this fixes lines that are just ^etc.$
  if (line === 'etc.' && index > 0) {
    lines[index - 1] = `${lines[index - 1]} etc.`;
    return lines;
  }

  if (getLeadingRef(line) && index) {
    const pos = getLeadingRef(line) || 0;
    const ref = line.substring(0, pos);
    const rest = line.substring(pos).trim();
    lines[index - 1] = `${lines[index - 1]} ${ref}`;
    lines.push(rest);
    return lines;
  }

  lines.push(line);
  return lines;
}

const getLeadingRef = memoize((line: string): number | null => {
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
});

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

function lineIsHeading(line: string): boolean {
  return line[0] === '=';
}

const regex = {
  assemble(arr: (string | RegExp)[], flags?: string): RegExp {
    return new RegExp(
      arr.map(p => (typeof p === 'string' ? p : p.source)).join(''),
      flags,
    );
  },

  groupsFirst(
    fn: (groups: { [k: string]: string }, substr: string, ...rest: any[]) => string,
  ): (substr: string, ...rest: any[]) => string {
    return (substr, ...rest) => {
      const last = rest[rest.length - 1];
      const groups = typeof last === 'string' ? {} : last;
      return fn(groups, substr, ...rest);
    };
  },
};

const NEWLINE = '__NEWLINE__';
