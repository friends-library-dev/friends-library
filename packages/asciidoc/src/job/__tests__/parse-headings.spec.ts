import { Asciidoc, Heading } from '@friends-library/types';
import { jobFromAdoc } from './test-helpers';

function parse(adoc: Asciidoc): Heading {
  const {
    spec: {
      sections: [section],
    },
  } = jobFromAdoc(adoc);
  return section.heading;
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
  ];

  test.each(cases)(
    'parses heading from %s',
    (adoc: Asciidoc, heading: Partial<Heading>) => {
      expect(parse(adoc)).toMatchObject(heading);
    },
  );
});
