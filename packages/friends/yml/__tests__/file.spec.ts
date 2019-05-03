import path from 'path';
import { kebabCase, without } from 'lodash';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import {
  yamlGlob,
  tags,
  editions,
  formats,
  chapters,
  hasProp,
  isSlug,
} from '../test-helpers';
import { Friend, Document } from '../../src';

const files = yamlGlob(path.resolve(__dirname, '../../yml/*/*.yml'));
const filenames: string[] = [];

const isbnPath = path.resolve(
  __dirname,
  '../../../cover/public/images/isbn/_suffixes.txt',
);
const isbnPool = readFileSync(isbnPath)
  .toString()
  .trim()
  .split('\n');
const isbns: string[] = [];

describe('all files', () => {
  test('files is not empty', () => {
    expect(files.length).not.toBe(0);
  });

  test('only contains yml files', () => {
    files.forEach(file => expect(file.name).toMatch(/\.yml$/));
  });

  test('filename slugs are kebab-case', () => {
    const slugs = files.map(f => f.name.replace(/\.yml$/, ''));
    slugs.forEach(slug => expect(slug).toBe(kebabCase(slug)));
  });
});

files.forEach(file => {
  describe(`${file.short}`, () => {
    let friend: Friend;
    let documents: Document[];
    let fileContents: string;

    try {
      fileContents = readFileSync(file.path, 'utf8');
      friend = safeLoad(fileContents);
      documents = friend.documents; // eslint-disable-line prefer-destructuring
    } catch (err) {
      throw new Error(err.message);
    }

    // @TODO re-enable this test when things stabilize
    xtest('no todo or lorem text', () => {
      // eslint-disable-line no-undef
      expect(fileContents).not.toContain(': TODO');
      expect(fileContents).not.toContain('Lorem');
    });

    test('has correct friend props', () => {
      const keys = Object.keys(friend);
      expect(keys).toEqual(['name', 'slug', 'gender', 'description', 'documents']);
    });

    test('friend props are correct type', () => {
      expect(typeof friend.name).toBe('string');
      expect(typeof friend.slug).toBe('string');
      expect(typeof friend.description).toBe('string');

      expect(Array.isArray(friend.documents)).toBe(true);
    });

    test('friend slug is in correct format', () => {
      expect(isSlug(friend.slug)).toBe(true);
    });

    test('friend slug matches filename slug', () => {
      expect(file.name).toBe(`${friend.slug}.yml`);
    });

    test('friend is male or female or mixed (for compilations)', () => {
      expect(['male', 'female', 'mixed'].includes(friend.gender)).toBe(true);
    });

    test('no dual friends', () => {
      expect(friend.name).not.toContain(' and ');
      expect(friend.name).not.toContain(' y ');
    });

    test('has correct document props', () => {
      documents.forEach(document => {
        expect(
          without(Object.keys(document).sort(), 'original_title', 'published'),
        ).toEqual(['description', 'editions', 'filename', 'slug', 'tags', 'title']);
      });
    });

    test('document slugs are unique', () => {
      const slugs: string[] = [];
      documents.forEach((doc: Document) => {
        expect(slugs.indexOf(doc.slug)).toBe(-1);
        slugs.push(doc.slug);
      });
    });

    test('document slugs are in correct format', () => {
      documents.forEach(doc => expect(isSlug(doc.slug)).toBe(true));
    });

    test('document filenames are globally unique', () => {
      documents.forEach(doc => {
        expect(filenames.indexOf(doc.filename)).toBe(-1);
        filenames.push(doc.filename);
      });
    });

    test('document props are correct type', () => {
      documents.forEach(document => {
        expect(typeof document.title).toBe('string');
        expect(typeof document.slug).toBe('string');
        expect(typeof document.description).toBe('string');
        expect(typeof document.filename).toBe('string');

        expect(Array.isArray(document.tags)).toBe(true);
        expect(Array.isArray(document.editions)).toBe(true);
      });
    });

    test('document tags are correct', () => {
      tags(friend).forEach(tag => {
        expect(typeof tag).toBe('string');
        expect(tag).toBe(kebabCase(tag));
      });
    });

    test('document filenames may not have spaces', () => {
      documents.forEach(document => {
        const hasSpace = document.filename.indexOf(' ') !== -1;
        expect(hasSpace).toBe(false);
      });
    });

    test('editions have correct type', () => {
      editions(friend).forEach(edition => {
        expect(['updated', 'original', 'modernized'].indexOf(edition.type)).not.toBe(-1);
      });
    });

    test('edition pages is number if exists', () => {
      editions(friend).forEach(edition => {
        if (!hasProp(edition, 'pages')) {
          return;
        }
        expect(typeof edition.pages).toBe('number');
        expect(parseInt(String(edition.pages), 10)).toBe(edition.pages);
      });
    });

    test('edition formats is array', () => {
      editions(friend).forEach(edition => {
        expect(Array.isArray(edition.formats)).toBe(true);
      });
    });

    test('edition isbn is correct if exists', () => {
      editions(friend).forEach(edition => {
        if (!hasProp(edition, 'isbn')) {
          return;
        }
        expect(edition.isbn).toMatch(/^978-1-64476-[0-9]{3}-[0-9]$/);
      });
    });

    test('updated editions have editor', () => {
      editions(friend).forEach(edition => {
        if (edition.type === 'updated' && file.path.indexOf('/es/') === -1) {
          expect(hasProp(edition, 'editor')).toBe(true);
          expect(typeof edition.editor).toBe('string');
        }
      });
    });

    test('edition isbns are correctly formatted', () => {
      editions(friend).forEach(edition => {
        if (hasProp(edition, 'isbn')) {
          const { isbn } = edition;
          expect(isbn).toMatch(/^978-1-64476-\d\d\d-\d$/);
        }
      });
    });

    test('edition isbns are one of ours', () => {
      editions(friend).forEach(edition => {
        if (hasProp(edition, 'isbn')) {
          const suffix = edition.isbn!.replace(/^978-1-64476-/, '');
          expect(isbnPool.includes(suffix)).toBe(true);
        }
      });
    });

    test('edition isbns are unique', () => {
      editions(friend).forEach(edition => {
        if (hasProp(edition, 'isbn')) {
          expect(isbns.includes(edition.isbn!)).toBe(false);
          isbns.push(edition.isbn!);
        }
      });
    });

    test('formats have correct type', () => {
      const types = ['pdf', 'mobi', 'epub', 'paperback', 'audio'];
      formats(friend).forEach(format => {
        expect(types.indexOf(format.type)).not.toBe(-1);
      });
    });

    test('audio format requires audio data', () => {
      editions(friend).forEach(edition => {
        edition.formats.forEach(format => {
          if (format.type !== 'audio') {
            return;
          }
          expect(hasProp(edition, 'audio')).toBe(true);
        });
      });
    });

    test('audio data requires corresponding edition format of audio', () => {
      editions(friend).forEach(edition => {
        if (!hasProp(edition, 'audio')) {
          return;
        }
        const formatTypes = edition.formats.map(format => format.type);
        expect(formatTypes.indexOf('audio') !== -1).toBe(true);
      });
    });

    test('editions have at least one chapter', () => {
      editions(friend).forEach(edition => {
        expect(Array.isArray(edition.chapters)).toBe(true);
        expect(edition.chapters.length > 0).toBe(true);
      });
    });

    test('chapters have non-empty string titles or number', () => {
      chapters(friend).forEach(chapter => {
        if (hasProp(chapter, 'title')) {
          expect(typeof chapter.title).toBe('string');
          expect(chapter.title).toBeTruthy();
        } else {
          expect(typeof chapter.number).toBe('number');
          expect(parseInt(String(chapter.number), 10)).toBe(chapter.number);
        }
      });
    });

    test('chapters may have optional non-empty subtitles', () => {
      chapters(friend).forEach(chapter => {
        if (hasProp(chapter, 'subtitle')) {
          expect(typeof chapter.subtitle).toBe('string');
          expect(chapter.subtitle).toBeTruthy();
        }
      });
    });
  });
});
