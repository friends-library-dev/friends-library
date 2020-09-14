import { firstEdition } from './helpers';

describe(`Edition`, () => {
  describe(`filename()`, () => {
    it(`should give the right filename`, () => {
      const edition = firstEdition((f) => {
        f.documents[0].filename = `Journal_of_George_Fox`;
        f.documents[0].editions[0].type = `updated`;
      });

      expect(edition.filename(`paperback-interior`)).toBe(
        `Journal_of_George_Fox--updated--(print).pdf`,
      );

      expect(edition.filename(`web-pdf`)).toBe(`Journal_of_George_Fox--updated.pdf`);
      expect(edition.filename(`epub`)).toBe(`Journal_of_George_Fox--updated.epub`);
      expect(edition.filename(`paperback-cover`)).toBe(
        `Journal_of_George_Fox--updated--cover.pdf`,
      );
      expect(edition.filename(`mobi`)).toBe(`Journal_of_George_Fox--updated.mobi`);

      expect(edition.filename(`paperback-cover`, 1)).toBe(
        `Journal_of_George_Fox--updated--cover--v1.pdf`,
      );
      expect(edition.filename(`paperback-interior`, 2)).toBe(
        `Journal_of_George_Fox--updated--(print)--v2.pdf`,
      );
      expect(edition.filename(`mobi`, 3)).toBe(`Journal_of_George_Fox--updated.mobi`);
    });
  });

  describe(`paperbackCoverBlurb`, () => {
    it(`returns edition description, if exists`, () => {
      const edition = firstEdition((f) => {
        f.documents[0].editions[0].description = `Edition desc.`;
      });
      expect(edition.paperbackCoverBlurb).toBe(`Edition desc.`);
    });

    it(`returns document description, if no edition description`, () => {
      const edition = firstEdition((f) => {
        f.documents[0].description = `Document desc.`;
      });
      expect(edition.paperbackCoverBlurb).toBe(`Document desc.`);
    });
  });
});
