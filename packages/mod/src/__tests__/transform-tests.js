// @flow
import transform from '../transform';

const first = (line, found) => {
  return Promise.resolve(found.map(loc => ({
    start: loc.start,
    end: loc.end,
    replace: loc.replace[0],
  })));
};

const resolve = (...replacements) => (line, found) => {
  return Promise.resolve(found.map(loc => ({
    start: loc.start,
    end: loc.end,
    replace: replacements.shift() || '',
  })));
};

const cases = [
  ['Thou foo thou\nthou ye bar.', 'You foo you\nyou you bar.', first],
  ['Be thou my vision', 'Be my vision', resolve('')],
  ['Foo bar withal;', 'Foo bar;', resolve('')],
];

test.each(cases)('%o => %o', async (orig, expected, resolver) => {
  const mod = await transform(orig, resolver);

  expect(mod).toBe(expected);
});
