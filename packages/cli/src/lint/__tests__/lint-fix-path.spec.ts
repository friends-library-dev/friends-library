import fs from 'fs-extra';
import stripIndent from 'strip-indent';
import lintFixPath from '../lint-fix-path';

describe(`lintFixPath()`, () => {
  test(`it can fix a file at a dir`, () => {
    const adoc = stripIndent(`
      == Chapter  1


      Foo •bar.
       Hash  baz.
      <<<<<<<
      Hello foo-
      bar, welcome "sir" to-day at sun-set.
    `).trim();

    const dir = `${__dirname}/__testdir__`;
    fs.mkdirpSync(dir);
    fs.writeFileSync(`${dir}/test.adoc`, `${adoc} `);

    const { unfixable, numFixed } = lintFixPath(dir);

    const expected = stripIndent(`
      == Chapter 1

      Foo bar.
      Hash baz.
      <<<<<<<
      Hello foo-bar,
      welcome "\`sir\`" today at sunset.
    `).trim();

    const fixed = fs.readFileSync(`${dir}/test.adoc`).toString();
    expect(fixed).toBe(`${expected}\n`);
    expect(numFixed).toBe(11);

    expect(unfixable.get(`${dir}/test.adoc`)!.lints).toHaveLength(1);
    expect(unfixable.get(`${dir}/test.adoc`)!.lints![0]).toMatchObject({
      line: 5,
      rule: `git-conflict-markers`,
    });

    fs.removeSync(dir);
  });
});
