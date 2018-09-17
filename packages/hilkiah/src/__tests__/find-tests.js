const { find } = require('../');

describe('find()', () => {
  it('returns empty array if no refs found', () => {
    const found = find('blah blah');

    expect(found).toEqual([]);
  });

  it('does not find Song of Solomon ref inside of Thessalonians ref', () => {
    const found = find('Blah blahh, 1 Thess. 5:2.');

    expect(found[0].book).toBe('1 Thessalonians');
    expect(found.length).toBe(1);
  });

  it('does not find Esther ref inside of James ref', () => {
    const found = find('brings forth death, James 1:15.');

    expect(found[0].book).toBe('James');
    expect(found.length).toBe(1);
  });

  it('does not find Revelation reference in "chap."', () => {
    const found = find('said of him by the prophet Isaiah, chap. xlix. 6, “I will');

    expect(found).toEqual([]);
  });

  const individualVerses = [
    ['Matthew', 17, 20, 'Matt. xvii. 20'],
    ['1 Corinthians', 1, 24, '1 Cor. i. 24.'],
    ['Matthew', 11, 29, 'ls,`" (Matt. xi. 29) the'],
    ['Psalms', 27, 1, 'id?`" (Psalm xxvii. 1.)'],
    ['John', 3, 16, 'red, (John iii. 16) "`Go'],
    ['John', 8, 12, 'world.`" (John, viii. 12.) The '],
    ['John', 12, 36, 'the text. (John xii. 36.)]'],
    ['Hebrews', 2, 9, 'man;`" (Heb. ii. 9) and his'],
    ['Romans', 3, 23, ' God.`" (Rom. iii. 23.) They'],
    ['Luke', 18, 13, ' sinner.`" (Luke, xviii. 13.) Abiding'],
    ['Titus', 2, 11, '(Titus, ii. 11.) By the'],
    ['John', 6, 44, 'him.`" (John vi. 44.)] they'],
    ['1 John', 2, 2, 'world.`" (1 John, ii. 2.) They'],
    ['Romans', 5, 11, 'Rom. v. 11.) Abiding'],
    ['Luke', 3, 16, 'fire.`" (Luke, iii. 16.)'],
    ['Malachi', 3, 2, 'fire,`" (Mai. iii. 2) than'],
    ['Luke', 9, 23, 'cross, (Luke iX. 23,) and'],
    ['2 Corinthians', 5, 17, '(2 Cor. v. 17.) The'],
    ['Matthew', 3, 12, 'fire.`" (Matt. iii. 12.) Having'],
    ['John', 1, 12, 'name.`" (John i. 12.)'],
    ['Matthew', 18, 3, '(Matt. xviii. 3.) It may'],
    ['1 Corinthians', 12, 6, 'in all.`" (1 Cor. xii. 6.)'],
    ['John', 3, 18, ' God;`" (John iii. 18) he'],
    ['1 John', 1, 7, '(See 1 John i. 7.)'],
    ['1 Corinthians', 6, 11, 'our God.`" (1 Cor. vi. 11.)'],
    ['John', 8, 12, 'life.`" (John viii. 12.) To'],
    ['John', 1, 4, 'men.`" (John i. 4.) By'],
    ['1 Peter', 1, 23, 'ever.`" (1 Peter i. 23.) Thus'],
    ['1 John', 1, 7, 'sin.`" (1 John i. 7.) Hence'],
    ['Isaiah', 49, 6, 'earth.`" (Isa. xlix. 6.) His'],
    ['Mark', 16, 16, 'saved.`" (Mark, xvi. 16.) The'],
    ['Romans', 8, 9, 'Christ.`" (Romans viii. 9.) "`A'],
    ['1 Corinthians', 12, 7, 'withal.`" (1 Cor. xii. 7.) It'],
    ['1 John', 2, 27, '(1 John ii. 27.) "`Christ'],
    ['Colossians', 1, 27, 'glory.`" (Col. i. 27.) The'],
    ['Ephesians', 5, 13, 'etc.`" (Eph. v. 13.)'],
    ['Hebrews', 11, 3, '(Heb. xi. 3.) The Apostle'],
    ['Romans', 10, 8, 'preach.`" (Rom. x. 8.) The'],
    ['James', 1, 21, 'souls.`" (Jas. i. 21.) The'],
    ['Hebrews', 3, 1, 'profession,`" (Heb. iii. 1) works'],
    ['Ephesians', 2, 18, 'Father.`" (Eph. ii. 18.) While'],
    ['John', 17, 3, 'eternal;`" (John xvii. 3) the'],
    ['Luke', 14, 27, 'disciple.`" (Luke xiv. 27.) Be'],
    ['Isaiah', 55, 4, 'Guide: (Isa. lv. 4:) and'],
    ['Isaiah', 49, 6, 'earth`" (Isa. xlix. 6.) They'],
    ['John', 1, 45, 'read,`" (who wrote of Christ, John i. 45,) "`the'],
    ['2 Corinthians', 13, 5, 'reprobates?`" (2 Cor. xiii. 5.) He'],
    ['Romans', 8, 9, 'his.`" (Rom. viii. 9.) We'],
    ['Isaiah', 55, 4, '"`Leader;`" (Isa. lv. 4,) and'],
    ['Ephesians', 5, 9, 'truth.`" (Eph. v. 9.) What'],
    ['Revelation', 11, 15, 'ever.`" (Rev. xi. 15.)'],
    ['John', 14, 6, 'me.`" (John xiv. 6.) "`Without'],
    ['John', 15, 5, 'nothing.`" (John xv. 5.) These'],
    ['Colossians', 2, 23, 'worship,`" (Col. ii. 23,) being'],
    ['Matthew', 15, 9, 'men.`" (Matt. xv. 9.)'],
    ['Matthew', 18, 20, 'them? (See Matt, xviii. 20.) The'],
    ['Romans', 8, 26, 'uttered;`" (Rom. viii. 26,) that'],
    ['Romans', 7, 6, 'letter;`" (Rom. vii. 6,) believing'],
    ['Matthew', 17, 5, 'hear: (Matt. xvii. 5:) "`If'],
    ['Luke', 9, 23, 'me.`" (Luke ix. 23.) The'],
    ['Galatians', 2, 20, '(Gal. ii. 20.) This '],
    ['Galatians', 5, 24, 'lusts.`" (Gal. v. 24.)'],
    // ['BOOK', 999, 111, 'CONTEXT'],
  ];

  test.each(individualVerses)('finds {%s %s:%s} from "%s"', (book, ch, vs, input) => {
    const [ref] = find(input);
    expect(ref.book).toBe(book);
    expect(ref.verses.length).toBe(1);
    expect(ref.contiguous).toBe(true);
    expect(ref.verses[0].chapter).toBe(ch);
    expect(ref.verses[0].verse).toBe(vs);
  });

  const multiRefs = [
    [
      'included; (see Hosea, xii. 6; Isai. xl. 31; Psalm xl. 1;) a duty',
      [
        ['Psalm xl. 1;', 'Psalms', 40, 1],
        ['Isai. xl. 31', 'Isaiah', 40, 31],
        ['Hosea, xii. 6', 'Hosea', 12, 6],
      ],
    ],
    [
      'with John viii. 12, and 1 John i. 7.\n',
      [
        ['John viii. 12', 'John', 8, 12],
        ['1 John i. 7', '1 John', 1, 7],
      ],
    ],
    [
      'im,`" (2 Pet. i. 17. Matt. xvii. 5;) --He',
      [
        ['Matt. xvii. 5;', 'Matthew', 17, 5],
        ['2 Pet. i. 17', '2 Peter', 1, 17],
      ],
    ],
    [
      '(Ezek. xxxiii. 18. 1 Cor. ix. 27.) So also',
      [
        ['Ezek. xxxiii. 18', 'Ezekiel', 33, 18],
        ['1 Cor. ix. 27.', '1 Corinthians', 9, 27],
      ],
    ],
    [
      'blah Jn 3:16 blah blah Joh 14:6',
      [
        ['Jn 3:16', 'John', 3, 16],
        ['Joh 14:6', 'John', 14, 6],
      ],
    ],
  ];

  test.each(multiRefs)('should extract multiple refs from "%s"', (input, expected) => {
    const refs = find(input);

    for (let i = 0; i < expected.length; i++) {
      expect(refs[i].match).toBe(expected[i][0]);
      expect(refs[i].book).toBe(expected[i][1]);
      expect(refs[i].verses[0].chapter).toBe(expected[i][2]);
      expect(refs[i].verses[0].verse).toBe(expected[i][3]);
    }
  });

  const multiVerses = [
    [
      'nd I in them.” (John xvii. 20, 21, 23, 26.) Foobar',
      {
        book: 'John',
        contiguous: false,
        verses: [
          { chapter: 17, verse: 20 },
          { chapter: 17, verse: 21 },
          { chapter: 17, verse: 23 },
          { chapter: 17, verse: 26 },
        ],
      },
    ],
    [
      'other.`" (Gal. v. 16, 17.) And',
      {
        book: 'Galatians',
        contiguous: true,
        verses: [
          { chapter: 5, verse: 16 },
          { chapter: 5, verse: 17 },
        ],
      },
    ],
    [
      'Father.`" (Phil. ii. 10, 11.) Were',
      {
        book: 'Philippians',
        contiguous: true,
        verses: [
          { chapter: 2, verse: 10 },
          { chapter: 2, verse: 11 },
        ],
      },
    ],
    [
      'God`" (2 Cor. v. 17, 18;) their',
      {
        book: '2 Corinthians',
        contiguous: true,
        verses: [
          { chapter: 5, verse: 17 },
          { chapter: 5, verse: 18 },
        ],
      },
    ],
    [
      'life.`" (See John v. 39, 40.)',
      {
        book: 'John',
        contiguous: true,
        verses: [
          { chapter: 5, verse: 39 },
          { chapter: 5, verse: 40 },
        ],
      },
    ],
    [
      'truth.`" (John iv. 23,24.) On',
      {
        book: 'John',
        contiguous: true,
        verses: [
          { chapter: 4, verse: 23 },
          { chapter: 4, verse: 24 },
        ],
      },
    ],
    [
      '(Gal. v. 22, 23.) Again',
      {
        book: 'Galatians',
        contiguous: true,
        verses: [
          { chapter: 5, verse: 22 },
          { chapter: 5, verse: 23 },
        ],
      },
    ],
    [
      'away.`" (2 Cor. iii. 15, 16.) So',
      {
        book: '2 Corinthians',
        contiguous: true,
        verses: [
          { chapter: 3, verse: 15 },
          { chapter: 3, verse: 16 },
        ],
      },
    ],
    [
      'men.`" (John i. 1, 3, 4.) Let',
      {
        book: 'John',
        contiguous: false,
        verses: [
          { chapter: 1, verse: 1 },
          { chapter: 1, verse: 3 },
          { chapter: 1, verse: 4 },
        ],
      },
    ],
    [
      'Jesus.`" (2 Tim. iii. 15, 16, 17.) They',
      {
        book: '2 Timothy',
        contiguous: true,
        verses: [
          { chapter: 3, verse: 15 },
          { chapter: 3, verse: 16 },
          { chapter: 3, verse: 17 },
        ],
      },
    ],
    [
      'do.`" (Heb. iv. 12, 13.) Here',
      {
        book: 'Hebrews',
        contiguous: true,
        verses: [
          { chapter: 4, verse: 12 },
          { chapter: 4, verse: 13 },
        ],
      },
    ],
    [
      'ever.`" (1 Peter i. 23, 24, 25.) In',
      {
        book: '1 Peter',
        contiguous: true,
        verses: [
          { chapter: 1, verse: 23 },
          { chapter: 1, verse: 24 },
          { chapter: 1, verse: 25 },
        ],
      },
    ],
    [
      'Jn 4:23-24',
      {
        book: 'John',
        contiguous: true,
        verses: [
          { chapter: 4, verse: 23 },
          { chapter: 4, verse: 24 },
        ],
      },
    ],
    [
      'Jn 4:23,27',
      {
        book: 'John',
        contiguous: false,
        verses: [
          { chapter: 4, verse: 23 },
          { chapter: 4, verse: 27 },
        ],
      },
    ],
    [
      'light.`" (John xii. 35, 36.) These',
      {
        book: 'John',
        contiguous: true,
        verses: [
          { chapter: 12, verse: 35 },
          { chapter: 12, verse: 36 },
        ],
      },
    ],
    [
      'world.`" (Titus ii. 11, 12.)',
      {
        book: 'Titus',
        contiguous: true,
        verses: [
          { chapter: 2, verse: 11 },
          { chapter: 2, verse: 12 },
        ],
      },
    ],
    [
      'world.`" (John i. 4--6.)',
      {
        book: 'John',
        contiguous: true,
        verses: [
          { chapter: 1, verse: 4 },
          { chapter: 1, verse: 5 },
          { chapter: 1, verse: 6 },
        ],
      },
    ],
    [
      'us.`" (2 Cor. iv. 6, 7.) The',
      {
        book: '2 Corinthians',
        contiguous: true,
        verses: [
          { chapter: 4, verse: 6 },
          { chapter: 4, verse: 7 },
        ],
      },
    ],
  ];

  test.each(multiVerses)('finds all verses from "%s"', (input, expected) => {
    const [ref] = find(input);
    Object.keys(expected).forEach(key => {
      expect(ref[key]).toEqual(expected[key]);
    });
  });

  const trailing = [
    ['Foo (1 Cor. i. 24.) bar.', '1 Cor. i. 24.', 'Foo (--) bar.'],
    ['Foo (1 Cor. i. 24:) bar.', '1 Cor. i. 24:', 'Foo (--) bar.'],
    ['Foo is 1 Cor. i. 24: bar.', '1 Cor. i. 24', 'Foo is --: bar.'],
    ['Foo (1 Cor. i. 24;) bar.', '1 Cor. i. 24;', 'Foo (--) bar.'],
    ['Foo is 1 Cor. i. 24; bar.', '1 Cor. i. 24', 'Foo is --; bar.'],
    ['Foo (1 Cor. i. 24,) bar.', '1 Cor. i. 24,', 'Foo (--) bar.'],
    ['Foo is 1 Cor. i. 24, bar.', '1 Cor. i. 24', 'Foo is --, bar.'],
    ['Foo (1 Cor. 1:24.) bar.', '1 Cor. 1:24.', 'Foo (--) bar.'],
    ['Foo (1 Cor. 1:3,4.) bar.', '1 Cor. 1:3,4.', 'Foo (--) bar.'],
    ['Foo (1 Cor. 1:1-3.) bar.', '1 Cor. 1:1-3.', 'Foo (--) bar.'],
    ['Foo (1 Cor. 1:1-3. ) bar.', '1 Cor. 1:1-3. ', 'Foo (--) bar.'],
    ['Foo (1 Cor. 1:1-3.  ) bar.', '1 Cor. 1:1-3.  ', 'Foo (--) bar.'],
    ['Foo is 1 Cor. i. 24. And...', '1 Cor. i. 24', 'Foo is --. And...'],
  ];

  test.each(trailing)('properly captures trailing junk for "%s"', (input, match, rpl) => {
    const [ref] = find(input);
    const { position: { start, end } } = ref;

    const result = `${input.substr(0, start)}--${input.substr(end)}`;

    expect(result).toBe(rpl);
    expect(ref.match).toBe(match);
  });

  it('does not include trailing period when not in parens', () => {
    const input = 'This is shown in 1 John 1. 7. And, more...';

    const [ref] = find(input);

    expect(ref.match).toBe('1 John 1. 7');
  });
});
