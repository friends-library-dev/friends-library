const { format } = require('../format');

describe('format', () => {
  let ref;

  beforeEach(() => {
    ref = {
      book: 'Galatians',
      contiguous: true,
      verses: [{ chapter: 1, verse: 1 }],
      match: 'Gal. i. 1',
    };
  });

  it('should format a single verse so good', () => {
    expect(format(ref)).toBe('Gal. 1:1');
  });

  it('should format a contiguous range correctly', () => {
    ref.verses.push({ chapter: 1, verse: 2 });
    ref.verses.push({ chapter: 1, verse: 3 });
    ref.verses.push({ chapter: 1, verse: 4 });

    expect(format(ref)).toBe('Gal. 1:1-4');
  });

  it('should format a non-contiguous range correctly', () => {
    ref.contiguous = false;
    ref.verses.push({ chapter: 1, verse: 2 });
    ref.verses.push({ chapter: 1, verse: 3 });
    ref.verses.push({ chapter: 1, verse: 7 });

    expect(format(ref)).toBe('Gal. 1:1,2,3,7');
  });

  it('should preserve full name if full book name found', () => {
    ref.match = 'Galatians i. 1.';

    expect(format(ref)).toBe('Galatians 1:1');
  });

  it('should shorten found fullname if option indicates', () => {
    ref.match = 'Galatians i. 1.';

    expect(format(ref, { preserveFull: false })).toBe('Gal. 1:1');
  });
});
