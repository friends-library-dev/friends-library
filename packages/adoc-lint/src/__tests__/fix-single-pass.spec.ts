import { LintResult, Asciidoc } from '@friends-library/types';
import singlePassFix from '../fix-single-pass';
import stripIndent from 'strip-indent';
import lint from '../lint';

describe(`singlePassFix()`, () => {
  it(`can fix a single line`, () => {
    const lints = [
      {
        line: 1,
        fixable: true,
        recommendation: `Foo bar.`,
      },
    ] as LintResult[];

    const adoc = `Foo  bar.`;

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Foo bar.`);
  });

  it(`can fix multiple lines`, () => {
    const lints = [
      {
        line: 1,
        fixable: true,
        recommendation: `Foo bar.`,
      },
      {
        line: 2,
        fixable: true,
        recommendation: `Hash baz.`,
      },
    ] as LintResult[];

    const adoc = `Foo  bar.\n  Hash baz.`;

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Foo bar.\nHash baz.`);
  });

  it(`does not fix unfixable lints`, () => {
    const lints = [
      {
        line: 1,
        fixable: false,
        recommendation: `Foo bar.`,
      },
      {
        line: 2,
        fixable: true,
        // missing recommendation
      },
    ] as LintResult[];

    const adoc = `Foo  bar.\n  Hash baz.`;

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(adoc);
  });

  it(`only fixes one recommendation per line`, () => {
    const lints = [
      {
        line: 1,
        fixable: true,
        recommendation: `Foo •bar`,
      },
      {
        line: 1,
        fixable: true,
        recommendation: ` Foo bar`,
      },
    ] as LintResult[];

    const adoc = ` Foo •bar`;

    const [fixed, unfixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Foo •bar`);
    expect(unfixed).toBe(1);
  });

  it(`can delete unwanted lines`, () => {
    const adoc = `Foo\n\n\nBar.\n`;
    const lints = lint(adoc);

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Foo\n\nBar.\n`);
  });

  it(`can delete footnote-paragraph-split extra lines`, () => {
    const adoc = `Foo\n{footnote-paragraph-split}\n\nBar.\n`;
    const lints = lint(adoc);

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Foo\n{footnote-paragraph-split}\nBar.\n`);
  });

  it(`can perform multi-line fix`, () => {
    const adoc = `Hello foo-\nbar baz.\n`;
    const lints = lint(adoc);

    const [fixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Hello\nfoo-bar baz.\n`);
  });

  test(`trailing hyphen fix will go unfixed if next line already modified`, () => {
    const lints = [
      {
        line: 2,
        fixable: true,
        rule: `trailing-whitespace`,
        recommendation: `bar.`,
      },
      {
        line: 1,
        fixable: true,
        rule: `trailing-hyphen`,
        recommendation: `Hello\nfoo-bar. `,
      },
    ] as LintResult[];
    const adoc = `Hello foo-\nbar. `;

    const [fixed, unfixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Hello foo-\nbar.`);
    expect(unfixed).toBe(1);
  });

  test(`trailing-hyphen multi-line fix prevents next line from being fixed`, () => {
    const lints = [
      {
        line: 1,
        fixable: true,
        rule: `trailing-hyphen`,
        recommendation: `Hello\nfoo-bar. `,
      },
      {
        line: 2,
        fixable: true,
        rule: `trailing-whitepsace`,
        recommendation: `bar.`,
      },
    ] as LintResult[];
    const adoc = `Hello foo-\nbar. `;

    const [fixed, unfixed] = singlePassFix(adoc, lints);

    expect(fixed).toBe(`Hello\nfoo-bar. `);
    expect(unfixed).toBe(1);
  });

  test(`it can add extra line to end of file`, () => {
    const adoc = `Foo`;
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(`Foo\n`);
    expect(unfixed).toBe(0);
  });

  test(`it can add extra line for \`unspaced-class\` lint`, () => {
    const adoc = `Foo\n[.foo]\nBar\n`;
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(`Foo\n\n[.foo]\nBar\n`);
    expect(unfixed).toBe(0);
  });

  test(`it correctly handles multi-line fix of \`dangling-possessive\``, () => {
    const adoc = `Went to Bob\`'\ns house.\n`;
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(`Went to Bob\`'s\nhouse.\n`);
    expect(unfixed).toBe(0);
  });

  it(`it correctly handles multi-line fix of \`join-words\` rule`, () => {
    const adoc = `Foo bar every\nwhere\n`;
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(`Foo bar\neverywhere\n`);
    expect(unfixed).toBe(0);
  });

  it(`it correctly handles single-line fix of \`join-words\` rule`, () => {
    const adoc = `Foo bar every where\n`;
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(`Foo bar everywhere\n`);
    expect(unfixed).toBe(0);
  });

  it(`correctly handles adding space after numbered-group delimiter`, () => {
    const adoc =
      stripIndent(`
      [.numbered-group]
      ====

      [.numbered]
      Foo
      ====
      Bar
    `).trim() + `\n`;

    const expected =
      stripIndent(`
      [.numbered-group]
      ====

      [.numbered]
      Foo

      ====

      Bar
    `).trim() + `\n`;

    const lints = lint(adoc);
    const [fixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(expected);
  });

  const unspacedOpenBlocks: [Asciidoc][] = [
    [
      stripIndent(`
        [.embedded-content-document.letter]
        --
        Foo

        --

        Bar
      `).trim() + `\n`,
    ],

    [
      stripIndent(`
        [.embedded-content-document.letter]
        --
        
        Foo
        --

        Bar
      `).trim() + `\n`,
    ],

    [
      stripIndent(`
        [.embedded-content-document.letter]
        --
        
        Foo
        
        --
        Bar
      `).trim() + `\n`,
    ],
  ];

  const correctlySpacedOpenBlock =
    stripIndent(`
    [.embedded-content-document.letter]
    --
    
    Foo

    --

    Bar
  `).trim() + `\n`;

  test.each(unspacedOpenBlocks)(`should fix unspaced open block`, adoc => {
    const lints = lint(adoc);
    const [fixed, unfixed] = singlePassFix(adoc, lints);
    expect(fixed).toBe(correctlySpacedOpenBlock);
    expect(unfixed).toBe(0);
  });
});
