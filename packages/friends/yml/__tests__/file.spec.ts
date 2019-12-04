import path from 'path';
import { kebabCase } from 'lodash';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob, editions, hasProp } from '../test-helpers';

const files = yamlGlob(path.resolve(__dirname, '../../yml/*/*.yml')).filter(
  file => !['en/jane-doe.yml', 'en/john-doe.yml'].includes(file.short),
);
const filenames: string[] = [];

const isbnPath = path.resolve(
  __dirname,
  '../../../cover-web-app/public/images/isbn/_suffixes.txt',
);
const isbnPool = readFileSync(isbnPath)
  .toString()
  .trim()
  .split('\n');
const isbns: string[] = [];
const ids: string[] = [];

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
    let friend: any;
    let documents: any[];
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

    test('ids must be unique', done => {
      if (ids.indexOf(friend.id) !== -1) {
        done.fail(`Invalid duplicate id ${friend.id}`);
        return;
      }
      ids.push(friend.id);
      done();
    });

    test('friend slug matches filename slug', () => {
      expect(file.name).toBe(`${friend.slug}.yml`);
    });

    test('no dual friends', () => {
      expect(friend.name).not.toContain(' and ');
      expect(friend.name).not.toContain(' y ');
    });

    test('document slugs are unique', () => {
      const slugs: string[] = [];
      documents.forEach((doc: any) => {
        expect(slugs.indexOf(doc.slug)).toBe(-1);
        slugs.push(doc.slug);
      });
    });

    test('document filenames are globally unique', () => {
      documents.forEach(doc => {
        expect(filenames.indexOf(doc.filename)).toBe(-1);
        filenames.push(doc.filename);
      });
    });

    test('document ids must be unique', done => {
      documents.forEach(doc => {
        if (ids.indexOf(doc.id) !== -1) {
          done.fail(`Invalid duplicate id ${doc.id}`);
          return;
        }
        ids.push(doc.id);
        done();
      });
    });

    test('edition isbns are one of ours', () => {
      editions(friend).forEach(edition => {
        const suffix = edition.isbn!.replace(/^978-1-64476-/, '');
        expect(isbnPool.includes(suffix)).toBe(true);
      });
    });

    test('edition isbns are unique', () => {
      editions(friend).forEach(edition => {
        expect(isbns.includes(edition.isbn!)).toBe(false);
        isbns.push(edition.isbn!);
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
  });
});
