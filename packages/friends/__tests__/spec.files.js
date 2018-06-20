import { kebabCase } from 'lodash';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob, tags, editions, formats, chapters, hasProp, isSlug } from '../test-helpers';

const files = yamlGlob('src/*/*.yml');

const filenames = [];

describe('all files', () => {
  test('only contains yml files', () => {
    files.forEach(file => expect(file.name).toMatch(/\.yml$/));
  });

  test('filename slugs are kebab-case', () => {
    const slugs = files.map(f => f.name.replace(/\.yml$/, ''));
    slugs.forEach(slug => expect(slug).toBe(kebabCase(slug)));
  });
});

files.forEach((file) => {
  describe(`${file.short}`, () => {
    let friend;
    let documents;

    test('is valid yaml', () => {
      try {
        friend = safeLoad(readFileSync(file.path, 'utf8'));
        documents = friend.documents; // eslint-disable-line prefer-destructuring
      } catch (err) {
        throw new Error(err.message);
      }
    });

    test('has correct friend props', () => {
      const keys = Object.keys(friend);
      expect(keys).toEqual(['name', 'slug', 'gender', 'description', 'documents']);
    });

    test('friend props are correct type', () => {
      ['name', 'slug', 'description']
        .forEach(key => expect(typeof friend[key]).toBe('string'));

      expect(Array.isArray(friend.documents)).toBe(true);
    });

    test('friend slug is in correct format', () => {
      expect(isSlug(friend.slug)).toBe(true);
    });

    test('friend slug matches filename slug', () => {
      expect(file.name).toBe(`${friend.slug}.yml`);
    });

    test('friend is male or female', () => {
      expect(['male', 'female'].includes(friend.gender)).toBe(true);
    });

    test('has correct document props', () => {
      documents.forEach((document) => {
        expect(Object.keys(document).sort()).toEqual([
          'description',
          'editions',
          'filename',
          'slug',
          'tags',
          'title',
        ]);
      });
    });

    test('document slugs are unique', () => {
      const slugs = [];
      documents.forEach((doc) => {
        expect(slugs.indexOf(doc.slug)).toBe(-1);
        slugs.push(doc.slug);
      });
    });

    test('document slugs are in correct format', () => {
      documents.forEach(doc => expect(isSlug(doc.slug)).toBe(true));
    });

    test('document filenames are globally unique', () => {
      documents.forEach((doc) => {
        expect(filenames.indexOf(doc.filename)).toBe(-1);
        filenames.push(doc.filename);
      });
    });

    test('document props are correct type', () => {
      documents.forEach((document) => {
        ['title', 'slug', 'description', 'filename']
          .forEach(key => expect(typeof document[key]).toBe('string'));

        ['tags', 'editions']
          .forEach(key => expect(Array.isArray(document[key])).toBe(true));
      });
    });

    test('document tags are correct', () => {
      tags(friend).forEach((tag) => {
        expect(typeof tag).toBe('string');
        expect(tag).toBe(kebabCase(tag));
      });
    });

    test('document filenames may not have spaces', () => {
      documents.forEach((document) => {
        const hasSpace = document.filename.indexOf(' ') !== -1;
        expect(hasSpace).toBe(false);
      });
    });

    test('editions have correct type', () => {
      editions(friend).forEach((edition) => {
        expect(['updated', 'original', 'modernized'].indexOf(edition.type)).not.toBe(-1);
      });
    });

    test('edition pages is number if exists', () => {
      editions(friend).forEach((edition) => {
        if (!hasProp(edition, 'pages')) {
          return;
        }
        expect(typeof edition.pages).toBe('number');
        expect(parseInt(edition.pages, 10)).toBe(edition.pages);
      });
    });

    test('edition formats is array', () => {
      editions(friend).forEach((edition) => {
        expect(Array.isArray(edition.formats)).toBe(true);
      });
    });

    test('formats have correct type', () => {
      const types = ['pdf', 'mobi', 'epub', 'softcover', 'audio'];
      formats(friend).forEach((format) => {
        expect(types.indexOf(format.type)).not.toBe(-1);
      });
    });

    test('audio format requires audio data', () => {
      editions(friend).forEach((edition) => {
        edition.formats.forEach((format) => {
          if (format.type !== 'audio') {
            return;
          }
          expect(hasProp(edition, 'audio')).toBe(true);
        });
      });
    });

    test('audio data requires corresponding edition format of audio', () => {
      editions(friend).forEach((edition) => {
        if (!hasProp(edition, 'audio')) {
          return;
        }
        const formatTypes = edition.formats.map(format => format.type);
        expect(formatTypes.indexOf('audio') !== -1).toBe(true);
      });
    });

    test('editions have at least one chapter', () => {
      editions(friend).forEach((edition) => {
        expect(Array.isArray(edition.chapters)).toBe(true);
        expect(edition.chapters.length > 0).toBe(true);
      });
    });

    test('chapters have non-empty string titles or number', () => {
      chapters(friend).forEach((chapter) => {
        if (hasProp(chapter, 'title')) {
          expect(typeof chapter.title).toBe('string');
          expect(chapter.title).toBeTruthy();
        } else {
          expect(typeof chapter.number).toBe('number');
          expect(parseInt(chapter.number, 10)).toBe(chapter.number);
        }
      });
    });

    test('chapters may have optional non-empty subtitles', () => {
      chapters(friend).forEach((chapter) => {
        if (hasProp(chapter, 'subtitle')) {
          expect(typeof chapter.subtitle).toBe('string');
          expect(chapter.subtitle).toBeTruthy();
        }
      });
    });
  });
});
