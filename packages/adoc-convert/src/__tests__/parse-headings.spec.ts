import { Asciidoc, Heading } from '@friends-library/types';
import processDocument from '../process-document';

function parse(adoc: Asciidoc): Heading {
  const { sections } = processDocument(adoc);
  return sections[0].heading;
}

describe('parsing headings', () => {
  const cases: [Asciidoc, Partial<Heading>][] = [
    [
      '== Forward',
      {
        id: '_forward',
        text: 'Forward',
      },
    ],

    [
      '== Chapter 3: Foobar',
      {
        text: 'Foobar',
        sequence: {
          type: 'Chapter',
          number: 3,
        },
      },
    ],

    [
      '== Chapter x',
      {
        sequence: {
          type: 'Chapter',
          number: 10,
        },
      },
    ],

    [
      '== Section 5: Lorem',
      {
        text: 'Lorem',
        sequence: {
          type: 'Section',
          number: 5,
        },
      },
    ],

    [
      '[#ch10, short="Prayer, Ministry, Wisdom, & Kingdom"]\n== Chapter X. The Prayer, Ministry, Wisdom and Kingdom which are Spiritual',
      {
        text: 'The Prayer, Ministry, Wisdom and Kingdom which are Spiritual',
        shortText: 'Prayer, Ministry, Wisdom, &#38; Kingdom',
        sequence: {
          type: 'Chapter',
          number: 10,
        },
      },
    ],
  ];

  test.each(cases)(
    'parses heading from %s',
    (adoc: Asciidoc, heading: Partial<Heading>) => {
      expect(parse(adoc)).toMatchObject(heading);
    },
  );
});
