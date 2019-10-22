import DocumentMeta from '../document-meta';
import { PrintSize } from '@friends-library/types';

describe('DocumentMeta()', () => {
  const testId = 'en/george-fox/journal/original';
  let meta: DocumentMeta;

  beforeEach(() => {
    meta = new DocumentMeta({
      [testId]: {
        updated: new Date().toLocaleString(),
        adocLength: 291357,
        numSections: 18,
        paperback: {
          size: 'xl',
          volumes: [435, 502],
          pageData: {
            s: 1453,
            m: 1143,
            xl: 922,
          },
        },
      },
    });
  });

  describe('.has()', () => {
    test('returns true for id found', () => {
      expect(meta.has(testId)).toBe(true);
    });

    test('returns false for id not found', () => {
      expect(meta.has('foo/bar')).toBe(false);
    });
  });

  describe('.get()', () => {
    test('returns null for unknown edition id', () => {
      expect(meta.get('foo/bar')).toBe(null);
    });

    test('returns EditionMeta object if found', () => {
      const ed = meta.get(testId);
      expect(ed!.numSections).toBe(18);
    });

    test('does not return mutable copy of underlying data', () => {
      const ed = meta.get(testId);
      ed!.adocLength = 555;
      const ed2 = meta.get(testId);
      expect(ed2!.adocLength).toBe(291357);
    });
  });

  describe('.set()', () => {
    it('replaces edition meta at that key', () => {
      const ed = meta.get(testId);
      ed!.adocLength = 555;
      meta.set(testId, ed!);
      const ed2 = meta.get(testId);
      expect(ed2!.adocLength).toBe(555);
    });

    it('creates edition meta at key if none exists', () => {
      const newId = 'foo/bar';
      const newMeta = {
        updated: new Date().toLocaleString(),
        adocLength: 111,
        numSections: 2,
        paperback: {
          size: 's' as PrintSize,
          volumes: [111],
          pageData: {
            s: 111,
            m: 98,
            xl: 55,
          },
        },
      };
      meta.set(newId, newMeta);
      expect(meta.get(newId)).toMatchObject(newMeta);
    });
  });

  describe('.getAll()', () => {
    test('returns array of all EditionMeta', () => {
      const eds = meta.getAll();
      expect(Array.isArray(eds)).toBe(true);
      expect(eds).toHaveLength(1);
      expect(eds[0]).toMatchObject(meta.get(testId)!);
    });
  });
});

/* API THAT WILL COVER USE CASES

repo.fetch()

dm.has('id')
dm.getAll()

const em = dm.get('id')
em.updated = 'lol'; // <-- should not mutate underlying data
dm.set('id', em)

repo.persist(dm)

*/
