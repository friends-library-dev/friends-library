import { useMultiColLayout } from '../frontmatter';

describe(`useMultiColLayout()`, () => {
  const BARE_TITLE = { text: `Preface` };
  const INTERMEDIATE_TITLE = { text: `Preface` };
  const BARE_CHAPTER = { text: ``, sequence: { type: `Chapter`, number: 1 } };
  const NAMED_CHAPTER = { text: `Memoir`, sequence: { type: `Chapter`, number: 1 } };

  test(`doc with mostly named chapters should use multi-col layout`, () => {
    const doc = [
      { heading: BARE_TITLE },
      { heading: NAMED_CHAPTER },
      { heading: NAMED_CHAPTER },
      { heading: NAMED_CHAPTER },
      { heading: NAMED_CHAPTER },
    ];
    expect(useMultiColLayout(doc)).toBe(true);
  });

  test(`doc with mostly bare chapters should not use multi-col layout`, () => {
    const doc = [
      { heading: BARE_TITLE },
      { heading: BARE_CHAPTER },
      { heading: BARE_CHAPTER },
      { heading: BARE_CHAPTER },
      { heading: BARE_CHAPTER },
    ];
    expect(useMultiColLayout(doc)).toBe(false);
  });

  test(`doc with only bare title sections should not use multi-col layout`, () => {
    const doc = [
      { heading: BARE_TITLE },
      { heading: BARE_TITLE },
      { heading: BARE_TITLE },
      { heading: BARE_TITLE },
      { heading: BARE_TITLE },
    ];
    expect(useMultiColLayout(doc)).toBe(false);
  });

  test(`doc with without majority of named chapters should not use multi-col`, () => {
    const doc = [
      { heading: BARE_TITLE },
      { heading: BARE_CHAPTER },
      { heading: BARE_CHAPTER },
      { heading: NAMED_CHAPTER },
      { heading: NAMED_CHAPTER },
    ];
    expect(useMultiColLayout(doc)).toBe(false);
  });

  test(`intermediate titles are not counted when determining layout`, () => {
    const doc = [
      { heading: BARE_TITLE },
      { heading: INTERMEDIATE_TITLE, isIntermediateTitle: true },
      { heading: NAMED_CHAPTER },
      { heading: INTERMEDIATE_TITLE, isIntermediateTitle: true },
      { heading: NAMED_CHAPTER },
      { heading: INTERMEDIATE_TITLE, isIntermediateTitle: true },
      { heading: NAMED_CHAPTER },
      { heading: INTERMEDIATE_TITLE, isIntermediateTitle: true },
      { heading: NAMED_CHAPTER },
    ];
    expect(useMultiColLayout(doc)).toBe(true);
  });
});
