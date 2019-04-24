import { kebabCase } from 'lodash';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob, editions, audioParts, hasProp } from '../test-helpers';

const files = yamlGlob('src/*/*.yml');

describe('all files', () => {
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
    const friend = safeLoad(readFileSync(file.path, 'utf8'));

    test('edition audio (when exists) has correct keys', () => {
      editions(friend).forEach(edition => {
        if (!hasProp(edition, 'audio')) {
          return;
        }
        expect(Object.keys(edition.audio!)).toEqual(['reader', 'parts']);
        expect(typeof edition.audio!.reader).toBe('string');
        expect(edition.audio!.reader).not.toBe('');
        expect(Array.isArray(edition.audio!.parts)).toBe(true);
        expect(edition.audio!.parts.length > 0).toBe(true);
      });
    });

    test('audio parts title is string if it exists', () => {
      audioParts(friend).forEach(part => {
        if (!hasProp(part, 'title')) {
          return;
        }
        expect(typeof part.title).toBe('string');
        expect(part.title).not.toBe('');
      });
    });

    test('audio parts have external ids', () => {
      audioParts(friend).forEach(part => {
        expect(typeof part.externalIdHq).toBe('number');
        if (part.externalIdLq) {
          expect(typeof part.externalIdLq).toBe('number');
        }
      });
    });

    test('audio parts have filesizes', () => {
      audioParts(friend).forEach(part => {
        expect(typeof part.filesizeHq).toBe('number');
        if (part.filesizeLq) {
          expect(typeof part.filesizeLq).toBe('number');
        }
      });
    });

    test('audio parts hq filesize is larger than lq', () => {
      audioParts(friend).forEach(part => {
        if (part.filesizeLq) {
          expect(part.filesizeHq).toBeGreaterThan(part.filesizeLq);
        }
      });
    });

    test('audio parts chapters are required and should be an array of numbers', () => {
      audioParts(friend).forEach(part => {
        expect(Array.isArray(part.chapters)).toBe(true);
        part.chapters.forEach(ch => expect(typeof ch).toBe('number'));
      });
    });
  });
});
