// @flow

const small = 'a|an|and|as|at|but|by|en|for|if|in|of|on|or|the|to|via'.split('|');

const ucfirst = lower => lower.replace(/^\w/, c => c.toUpperCase());

export function capitalizeTitle(str: string): string {
  return str
    .split(' ')
    .map((word, index, parts) => {
      if (index === 0 || index === parts.length - 1) {
        return ucfirst(word);
      }
      return small.includes(word.toLowerCase()) ? word : ucfirst(word);
    })
    .join(' ');
}

export function trimTrailingPunctuation(str: string): string {
  return str.replace(/(?<!etc)[.,]$/, '');
}

export function wrapper(
  before: string,
  after: string,
): (
  acc: Array<string>,
  str: string,
  index: number,
  array: Array<string>,
) => Array<string> {
  return (acc = [], str, index, array) => {
    if (index === 0) {
      acc.unshift(before);
    }

    acc.push(str);

    if (index === array.length - 1) {
      acc.push(after);
    }

    return acc;
  };
}
