// @flow
import { identity } from 'lodash';
import type { Line, LineMutation } from './type';

const defaultOpts = {
  wrapBefore: identity,
  wrapAfter: identity,
  filterBefore: identity,
  filterAfter: identity,
};

export function mutateLine(
  line: Line,
  mutations: Array<LineMutation>,
  options: Object = {},
): Line {
  const opts = { ...defaultOpts, ...options };
  let adjust = 0;
  let mutated = line;

  mutations.forEach(({ start, end, replace }) => {
    const oldLength = end - start;
    const newLength = replace.length;

    let before = mutated.substr(Math.max(0 + adjust, 0), start + adjust);
    before = opts.filterBefore(before);
    before = opts.wrapBefore(before);

    let after = mutated.substr(end + adjust);
    after = opts.filterAfter(after);
    after = opts.wrapAfter(after);

    mutated = before.concat(replace, after);
    adjust = adjust + newLength - oldLength;
  });

  return mutated
    .replace(/  +/g, ' ')
    .replace(/ (\.|;|,)$/, '$1');
}
