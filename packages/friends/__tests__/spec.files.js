const glob = require('glob');
const { basename } = require('path');
const { kebabCase } = require('lodash');
const { safeLoad } = require('js-yaml');
const { readFileSync } = require('fs');

const paths = glob.sync('src/en/*');
const filenames = paths.map(p => basename(p));

describe('all files', () => {
  test('only contains yml files', () => {
    filenames.forEach(filename => expect(filename).toMatch(/\.yml$/));
  });

  test('filename slugs are kebab-case', () => {
    const slugs = filenames.map(f => f.replace(/\.yml$/, ''));
    slugs.forEach(slug => expect(slug).toBe(kebabCase(slug)));
  });
});

paths.forEach(path => {
  const shortPath = path.replace(/^src\//, '');

  describe(`${shortPath}`, () => {
    let friend;
    let documents;

    test('is valid yaml', () => {
      try {
        friend = safeLoad(readFileSync(path, 'utf8'));
        documents = friend.documents;
      } catch (err) {
        throw new Error(`${path} is not valid yaml`);
      }
    });

    test('has correct friend props', () => {
      const keys = Object.keys(friend);
      expect(keys).toEqual(['name', 'slug', 'description', 'documents']);
    });

    test('friend props are correct type', () => {
      ['name', 'slug', 'description']
        .forEach(key => expect(typeof friend[key]).toBe('string'));

      expect(Array.isArray(friend.documents)).toBe(true);
    });

    test('has correct document props', () => {
      documents.forEach(document => {
        expect(Object.keys(document)).toEqual([
          'title',
          'slug',
          'description',
          'tags',
          'editions',
        ]);
      });
    });

    test('document props are correct type', () => {
      documents.forEach(document => {
        ['title', 'slug', 'description']
          .forEach(key => expect(typeof document[key]).toBe('string'));

        ['tags', 'editions']
          .forEach(key => expect(Array.isArray(document[key])).toBe(true));
      });
    });

    test('document tags are correct', () => {
      documents.forEach(document => document.tags.forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag).toBe(kebabCase(tag));
      }));
    });

    test('editions have correct type', () => {
      documents.forEach(document => document.editions.forEach(edition => {
        expect(['updated', 'original', 'modernized'].indexOf(edition.type)).not.toBe(-1);
      }));
    });

    test('edition pages is number if exists', () => {
      documents.forEach(document => document.editions.forEach(edition => {
        if (!edition.hasOwnProperty('pages')) {
          return;
        }
        expect(typeof edition.pages).toBe('number');
        expect(parseInt(edition.pages, 10)).toBe(edition.pages);
      }));
    });

    test('edition formats is array', () => {
      documents.forEach(document => document.editions.forEach(edition => {
        expect(Array.isArray(edition.formats)).toBe(true);
      }));
    });

    test('formats have correct type', () => {
      const types = ['pdf', 'mobi', 'epub', 'softcover', 'audio'];
      documents.forEach(d => d.editions.forEach(e => e.formats.forEach(format => {
        expect(types.indexOf(format.type)).not.toBe(-1);
      })));
    });

    test('editions have at least one chapter', () => {
      documents.forEach(document => document.editions.forEach(edition => {
        expect(Array.isArray(edition.chapters)).toBe(true);
        expect(edition.chapters.length > 0).toBe(true);
      }));
    });

    test('chapters have non-empty string titles', () => {
      documents.forEach(d => d.editions.forEach(e => e.chapters.forEach(chapter => {
        expect(typeof chapter.title).toBe('string');
        expect(chapter.title).toBeTruthy();
      })));
    });
  });
});
