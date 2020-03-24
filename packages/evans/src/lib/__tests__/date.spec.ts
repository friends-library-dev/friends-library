import { documentDate, DateableDocument } from '../date';

describe('documentDate()', () => {
  let doc: DateableDocument;
  beforeEach(() => {
    doc = { path: 'en/george-fox/journal', friend: { isCompilationsQuasiFriend: false } };
  });

  it('should use timelineDate if present', () => {
    doc.timelineDate = 1709;
    doc.published = 1710;
    expect(documentDate(doc)).toBe(1709);
  });

  it('should use published date if no timeline date', () => {
    doc.published = 1710;
    expect(documentDate(doc)).toBe(1710);
  });

  it('should use death date for a friend who lived to be less than 31', () => {
    doc.friend.born = 1700;
    doc.friend.died = 1725;
    expect(documentDate(doc)).toBe(1725);
  });

  it('should guess 10 years less than death if we only have a death date', () => {
    doc.friend.died = 1740;
    expect(documentDate(doc)).toBe(1730);
  });

  it('should use 75% of age', () => {
    doc.friend.born = 1700;
    doc.friend.died = 1800;
    expect(documentDate(doc)).toBe(1775);
  });

  test('compilations can have no determinable date', () => {
    doc.friend.isCompilationsQuasiFriend = true;
    expect(documentDate(doc)).toBe(-1);
  });

  test('non compilations should throw if no date can be found', () => {
    expect(() => documentDate(doc)).toThrow();
  });
});
