import Chapter from '../Chapter';

describe('Chapter', () => {
  it('sets title when passed one', () => {
    const chapter = new Chapter({ title: 'Foo' });
    expect(chapter.title).toBe('Foo');
    expect(chapter.number).toBeUndefined();
    expect(chapter.subtitle).toBeUndefined();
  });

  it('sets number when passed one', () => {
    const chapter = new Chapter({ number: 3 });
    expect(chapter.number).toBe(3);
    expect(chapter.title).toBeUndefined();
    expect(chapter.subtitle).toBeUndefined();
  });

  it('sets subtitle when passed one', () => {
    const chapter = new Chapter({ title: 'Foo', subtitle: 'Bar' });
    expect(chapter.subtitle).toBe('Bar');
  });

  it('should throw if passed title and number', () => {
    expect(() => new Chapter({ title: 'Foo', number: 1 })).toThrow();
  });

  it('should throw if passed neither title nor number', () => {
    expect(() => new Chapter({})).toThrow();
  });
});
