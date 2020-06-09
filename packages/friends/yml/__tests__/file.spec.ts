import path from 'path';
import { kebabCase } from 'lodash';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob, editions, hasProp } from '../test-helpers';
import { FriendData, DocumentData } from '../../src/types';
import { isDefined, Lang } from '@friends-library/types';

const files = yamlGlob(path.resolve(__dirname, `../../yml/*/*.yml`)).filter(
  file => ![`en/jane-doe.yml`, `en/john-doe.yml`].includes(file.short),
);
const filenames: string[] = [];

const isbnPath = path.resolve(__dirname, `../../../cli/src/cmd/isbns/isbns.json`);
const isbnPool = JSON.parse(readFileSync(isbnPath).toString());
const isbns: string[] = [];
const ids: string[] = [];
const friends: FriendData[] = [];
const docMap: Map<string, DocumentData & { lang: Lang }> = new Map();

describe(`all files`, () => {
  test(`files is not empty`, () => {
    expect(files.length).not.toBe(0);
  });

  test(`only contains yml files`, () => {
    files.forEach(file => expect(file.name).toMatch(/\.yml$/));
  });

  test(`filename slugs are kebab-case`, () => {
    const slugs = files.map(f => f.name.replace(/\.yml$/, ``));
    slugs.forEach(slug => expect(slug).toBe(kebabCase(slug)));
  });
});

files.forEach(file => {
  describe(`${file.short}`, () => {
    let friend: FriendData;
    let documents: DocumentData[];
    let fileContents: string;

    try {
      fileContents = readFileSync(file.path, `utf8`);
      friend = safeLoad(fileContents);
      friend.lang = file.path.includes(`/es/`) ? `es` : `en`;
      friends.push(friend);
      documents = friend.documents; // eslint-disable-line prefer-destructuring
    } catch (err) {
      throw new Error(err.message);
    }

    test(`no asciidoc-style escaping`, () => {
      expect(fileContents).not.toContain(`+++[`);
    });

    test(`ids must be unique`, done => {
      if (ids.indexOf(friend.id) !== -1) {
        done.fail(`Invalid duplicate id ${friend.id}`);
        return;
      }
      ids.push(friend.id);
      done();
    });

    test(`friend slug matches filename slug`, () => {
      expect(file.name).toBe(`${friend.slug}.yml`);
    });

    test(`no dual friends`, () => {
      expect(friend.name).not.toContain(` and `);
      expect(friend.name).not.toContain(` y `);
    });

    test(`should have \`friend.added\` if a non-draft document exists`, () => {
      let hasNonDraftEdition = false;
      editions(friend).forEach(edition => {
        if (edition.draft === false || edition.draft === undefined) {
          hasNonDraftEdition = true;
        }
      });
      if (hasNonDraftEdition) {
        expect(friend.added).toBeInstanceOf(Date);
      }
    });

    test(`friend quotes use ellipses … rather than three dots`, () => {
      (friend.quotes || []).forEach(quote => {
        expect(quote.text).not.toMatch(/\.\.\./);
      });
    });

    test(`friend descriptions use ellipses … rather than three dots`, () => {
      expect(friend.description).not.toMatch(/\.\.\./);
    });

    test(`friend quotes have no straight quotes or double-dash`, () => {
      (friend.quotes || []).forEach(quote => {
        expect(quote.text).not.toMatch(/'|"|--/);
      });
    });

    test(`friend description has no straight quotes or double-dash`, () => {
      expect(friend.description).not.toMatch(/'|"|--/);
    });

    test(`document slugs are unique`, () => {
      const slugs: string[] = [];
      documents.forEach((doc: any) => {
        expect(slugs.indexOf(doc.slug)).toBe(-1);
        slugs.push(doc.slug);
      });
    });

    test(`document filenames are globally unique`, () => {
      documents.forEach(doc => {
        expect(filenames.indexOf(doc.filename)).toBe(-1);
        filenames.push(doc.filename);
      });
    });

    test(`document fields must not have straight quotes or double-dash`, () => {
      documents.forEach(doc => {
        expect(doc.description).not.toMatch(/'|"|--/);
        expect(doc.title).not.toMatch(/'|"/);
        expect(doc.partial_description).not.toMatch(/'|"|--/);
        expect(doc.original_title || ``).not.toMatch(/'|"|--/);
        expect(doc.featured_description || ``).not.toMatch(/'|"|--/);
        (doc.related_documents || []).forEach(related => {
          expect(related.description).not.toMatch(/'|"|--/);
        });
      });
    });

    test(`document fields must use ellipses … rather than three dots`, () => {
      documents.forEach(doc => {
        expect(doc.description).not.toMatch(/\.\.\./);
        expect(doc.title).not.toMatch(/\.\.\./);
        expect(doc.partial_description).not.toMatch(/\.\.\./);
        expect(doc.original_title || ``).not.toMatch(/\.\.\./);
        expect(doc.featured_description || ``).not.toMatch(/\.\.\./);
        (doc.related_documents || []).forEach(related => {
          expect(related.description).not.toMatch(/\.\.\./);
        });
      });
    });

    test(`document ids must be unique`, done => {
      documents.forEach(doc => {
        if (ids.indexOf(doc.id) !== -1) {
          done.fail(`Invalid duplicate id ${doc.id}`);
          return;
        }
        ids.push(doc.id);
        docMap.set(doc.id, { ...doc, lang: friend.lang });
        done();
      });
    });

    test(`non-draft entities may not have TODO or LOREM text`, () => {
      friend.documents.forEach(document => {
        document.editions.forEach(edition => {
          if (edition.draft !== true) {
            expect(friend.description).not.toMatch(/(^todo$)|\blorem\b/i);
            expect(document.description).not.toMatch(/(^todo$)|\blorem\b/i);
            expect(document.partial_description).not.toMatch(/(^todo$)|\blorem\b/i);
          }
        });
      });
    });

    test(`audio part titles must not have straight quotes or double-dash`, () => {
      editions(friend).forEach(edition => {
        (edition.audio || { parts: [] }).parts.forEach((part: any) => {
          expect(part.title).not.toMatch(/'|"|--/);
        });
      });
    });

    test(`edition isbns are one of ours`, () => {
      editions(friend).forEach(edition => {
        expect(isbnPool.includes(edition.isbn)).toBe(true);
      });
    });

    test(`edition isbns are unique`, () => {
      editions(friend).forEach(edition => {
        expect(isbns.includes(edition.isbn!)).toBe(false);
        isbns.push(edition.isbn!);
      });
    });

    test(`updated editions have editor`, () => {
      editions(friend).forEach(edition => {
        if (edition.type === `updated` && file.path.indexOf(`/es/`) === -1) {
          expect(hasProp(edition, `editor`)).toBe(true);
          expect(typeof edition.editor).toBe(`string`);
        }
      });
    });
  });
});

describe(`document.alt_language_id`, () => {
  friends.forEach(friend => {
    friend.documents.forEach(document => {
      const docPath = `${friend.lang}/${friend.slug}/${document.slug}`;
      const altId = document.alt_language_id;

      if (friend.lang === `es`) {
        test(`spanish doc ${docPath} must have alt_language_id`, () => {
          expect(altId).toBeDefined();
        });
      }

      if (isDefined(altId)) {
        test(`${docPath} doc.alt_language_id must exist`, () => {
          expect(docMap.has(altId)).toBe(true);
        });

        test(`${docPath} doc.alt_language_id must ref doc id in alt language`, () => {
          expect(docMap.get(altId)!.lang).not.toBe(friend.lang);
        });

        test(`${docPath} doc.alt_language_id must be reciprocal`, () => {
          expect(docMap.get(altId)!.alt_language_id).not.toBeUndefined();
          expect(docMap.get(altId)!.alt_language_id).toBe(document.id);
        });
      }
    });
  });
});

describe(`document.related_documents`, () => {
  friends.forEach(friend => {
    friend.documents.forEach(document => {
      if (!document.related_documents) {
        return;
      }

      test(`${document.filename} related_documents refer to known documents`, () => {
        document.related_documents!.forEach(related => {
          expect(docMap.has(related.id)).toBe(true);
        });
      });

      test(`${document.filename} related_documents do not refer to friends own docs`, () => {
        const friendDocs = friend.documents.map(doc => doc.id);
        document.related_documents!.forEach(related => {
          expect(friendDocs.includes(related.id)).toBe(false);
        });
      });
    });
  });
});
