const { find } = require('../');

describe('find()', () => {

  it('returns empty array if no refs found', () => {
    const found = find('blah blah');

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
    ['Luke', 9, 23, 'cross, (Luke ix. 23,) and'],
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
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
    // ['BOOK', 999, 111, 'CONTEXT'],
  ];

  test.each(individualVerses)(`finds {%s %s:%s} from "%s"`, (book, ch, vs, input) => {
    const [ref] = find(input);
    expect(ref.book).toBe(book);
    expect(ref.verses.length).toBe(1);
    expect(ref.contiguous).toBe(true);
    expect(ref.verses[0].chapter).toBe(ch);
    expect(ref.verses[0].verse).toBe(vs);
  });

  const multiRefs = [
    [
      'im,`" (2 Pet. i. 17. Matt. xvii. 5;) --He',
      [
        ['2 Pet. i. 17.', '2 Peter', 1, 17],
        ['Matt. xvii. 5;', 'Matthew', 17, 5],
      ]
    ],
    [
      '(Ezek. xxxiii. 18. 1 Cor. ix. 27.) So also',
      [
        ['Ezek. xxxiii. 18.', 'Ezekiel', 33, 18],
        ['1 Cor. ix. 27.', '1 Corinthians', 9, 27],
      ]
    ],
    [
      'blah Jn 3:16 blah blah Joh 14:6',
      [
        ['Jn 3:16', 'John', 3, 16],
        ['Joh 14:6', 'John',13, 6],
      ]
    ]
  ];

  test.each(multiRefs)(`should extract multiple refs from "%s"`, (input, expected) => {
    const refs = find(input);

    for (var i = 0; i < expected.length; i++) {
      refs[i].match = expected[0];
      refs[i].book = expected[1];
      refs[i].verses[0].chapter = expected[2];
      refs[i].verses[0].verse = expected[3];
    }
  });

  const multiVerses = [
    [
      'men.`" (John i. 1, 3, 4.) Let',
      {
        book: "John",
        contiguous: false,
        verses: [
          { chapter: 1, verse: 1 },
          { chapter: 1, verse: 3 },
          { chapter: 1, verse: 4 },
        ]
      }
    ],
    [
      'Jesus.`" (2 Tim. iii. 15, 16, 17.) They',
      {
        book: "2 Timothy",
        contiguous: true,
        verses: [
          { chapter: 3, verse: 15 },
          { chapter: 3, verse: 16 },
          { chapter: 3, verse: 17 },
        ]
      }
    ],
    [
      'do.`" (Heb. iv. 12, 13.) Here',
      {
        book: "Hebrews",
        contiguous: true,
        verses: [
          { chapter: 4, verse: 12 },
          { chapter: 4, verse: 13 },
        ]
      }
    ],
    [
      'ever.`" (1 Peter i. 23, 24, 25.) In',
      {
        book: "1 Peter",
        contiguous: true,
        verses: [
          { chapter: 1, verse: 23 },
          { chapter: 1, verse: 24 },
          { chapter: 1, verse: 25 },
        ]
      }
    ],
    [
      'Jn 4:23-24',
      {
        book: "John",
        contiguous: true,
        verses: [
          { chapter: 4, verse: 23 },
          { chapter: 4, verse: 24 },
        ]
      }
    ],
    [
      'Jn 4:23,27',
      {
        book: "John",
        contiguous: false,
        verses: [
          { chapter: 4, verse: 23 },
          { chapter: 4, verse: 27 },
        ]
      }
    ],
    [
      'light.`" (John xii. 35, 36.) These',
      {
        book: "John",
        contiguous: true,
        verses: [
          { chapter: 12, verse: 35 },
          { chapter: 12, verse: 36 },
        ]
      }
    ],
    [
      'world.`" (Titus ii. 11, 12.)',
      {
        book: "Titus",
        contiguous: true,
        verses: [
          { chapter: 2, verse: 11 },
          { chapter: 2, verse: 12 },
        ]
      }
    ],
    [
      'world.`" (John i. 4--6.)',
      {
        book: "John",
        contiguous: true,
        verses: [
          { chapter: 1, verse: 4 },
          { chapter: 1, verse: 5 },
          { chapter: 1, verse: 6 },
        ]
      }
    ],
    [
      'us.`" (2 Cor. iv. 6, 7.) The',
      {
        book: "2 Corinthians",
        contiguous: true,
        verses: [
          { chapter: 4, verse: 6 },
          { chapter: 4, verse: 7 },
        ]
      }
    ],
  ];

  test.each(multiVerses)(`finds all verses from "%s"`, (input, expected) => {
    const [ ref ] = find(input);
    for (let key in expected) {
      expect(ref[key]).toEqual(expected[key]);
    }
  });

  const trailingPeriods = [
    ['Foo (1 Cor. i. 24.) bar.', '1 Cor. i. 24.'],
    ['Foo (1 Cor. 1:24.) bar.', '1 Cor. 1:24.'],
    ['Foo (1 Cor. 1:3,4.) bar.', '1 Cor. 1:3,4.'],
    ['Foo (1 Cor. 1:1-3.) bar.', '1 Cor. 1:1-3.'],
  ];

  test.each(trailingPeriods)(`range for "%s" captures trailing period`, (input, match) => {
    const [ ref ] = find(input);
    const { position: { start, end } } = ref;

    const result = `${input.substr(0, start)}--${input.substr(end)}`;

    expect(result).toBe('Foo (--) bar.');
    expect(ref.match).toBe(match);
  });

  it('does not include trailing period when not in parens', () => {
    const input = 'This is shown in 1 John 1. 7. And, more...';

    const [ ref ] = find(input);

    expect(ref.match).toBe('1 John 1. 7');
  });
});

// Jn 3:15-20
// Jn 5:14,17
// Joh. iii. 6.
// Jude 14
// (John xiii. 13; Isai. Lv. 4; John x. 14, and xvi. 13; Heb. ii. 17.)


// errors
// Romans 3:8-3   <- range is weird
// Romans 22:14   <- invalid chapter
// Romans 8:72    <- invalid verses
// Romans 6:12-89 <- invalid verse in range
// (Titus ii. II, 12.) <- OCR artifact (i think) from rundell
