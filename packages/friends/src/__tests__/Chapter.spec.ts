import Chapter from '../Chapter';

describe('Chapter', () => {
  it('sets title when passed one', () => {
    const chapter = new Chapter({ title: 'Foo', number: undefined, subtitle: undefined });
    expect(chapter.title).toBe('Foo');
    expect(chapter.number).toBeUndefined();
    expect(chapter.subtitle).toBeUndefined();
  });

  it('sets number when passed one', () => {
    const chapter = new Chapter({ number: 3, title: undefined, subtitle: undefined });
    expect(chapter.number).toBe(3);
    expect(chapter.title).toBeUndefined();
    expect(chapter.subtitle).toBeUndefined();
  });

  it('sets number & subtitle when passed one', () => {
    const chapter = new Chapter({ title: undefined, subtitle: 'Bar', number: 3 });
    expect(chapter.subtitle).toBe('Bar');
    expect(chapter.number).toBe(3);
  });
});
