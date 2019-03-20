export function makeReduceWrapper(
  before: string,
  after: string,
): (acc: string[], str: string, index: number, array: string[]) => string[] {
  return (acc = [], str, index, array) => {
    index === 0 && acc.unshift(before);
    acc.push(str);
    index === array.length - 1 && acc.push(after);
    return acc;
  };
}

export const br7 = '<br class="m7"/>';
