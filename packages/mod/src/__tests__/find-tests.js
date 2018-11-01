import find from '../find';

describe('find.thou()', () => {
  const thous = [
    ['Dost thou foo?', [[5, 9, 'thou', ['you']]]],
    ['Dost thou Thou me?', [[5, 9, 'thou', ['you']], [10, 14, 'Thou', ['You']]]],
    ['Through it all', []],
    ['[.thou-class]', []], // <-- no matches should be found in asciidoc directives
  ];

  test.each(thous)('it finds `thou`s in "%s"', (line, short) => {
    const locs = short.map(([start, end, match, replace]) => ({ start, end, match, replace, prompt: true }));
    expect(find.thou(line)).toEqual(locs);
  });
});
