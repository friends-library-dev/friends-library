import { choiceData } from '../prompt';

jest.mock('chalk', () => ({
  green: s => s,
  gray: s => s,
  magenta: s => s,
}));

describe('choiceData()', () => {
  it('handles the happy path!', () => {
    const line = 'Hath foo';
    const loc = {
      start: 0,
      end: 4,
      match: 'Hath',
      replace: ['Has'],
    };

    const data = choiceData(loc, line);
    const [has, keep, remove, custom] = data;

    expect(data.length).toBe(4);

    expect(has).toMatchObject({
      value: 'Has',
      display: '"Has"',
      isKeep: false,
      isRemove: false,
      isCustom: false,
      proposed: 'Has foo',
    });

    expect(keep).toMatchObject({
      value: 'Hath',
      display: '"Hath"',
      isKeep: true,
      isRemove: false,
      isCustom: false,
    });

    expect(remove).toMatchObject({
      value: '',
      display: ' ____ ',
      isKeep: false,
      isRemove: true,
      isCustom: false,
    });

    expect(custom).toMatchObject({
      value: '<<custom>>',
      display: ' ???? ',
      isKeep: false,
      isRemove: false,
      isCustom: true,
    });
  });

  test('keep is first if replace indicates', () => {
    const line = 'Own foo';
    const loc = {
      start: 0,
      end: 3,
      match: 'Own',
      replace: ['Own', 'Affirm'],
    };

    const data = choiceData(loc, line);
    const [keep, affirm, remove, custom] = data;

    expect(data.length).toBe(4);
    expect(keep.isKeep).toBe(true);
    expect(affirm.value).toBe('Affirm');
    expect(remove.isRemove).toBe(true);
    expect(custom.isCustom).toBe(true);
  });

  test('remove is first if replace indicates', () => {
    const line = 'Foo withal';
    const loc = {
      start: 4,
      end: 11,
      match: 'withal',
      replace: ['', 'with'],
    };

    const data = choiceData(loc, line);

    expect(data.length).toBe(4);
    const [remove, toWith, keep, custom] = data;

    expect(remove.isRemove).toBe(true);
    expect(toWith.value).toBe('with');
    expect(keep.isKeep).toBe(true);
    expect(custom.isCustom).toBe(true);
  });
});
