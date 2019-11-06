import stripIndent from 'strip-indent';
import gitConflictMarkers from '../git-conflict-markers';

const opts = { lang: 'en' as const };

describe('gitConflictMarkers()', () => {
  it('creates lint violations for git conflict markers', () => {
    const adoc = stripIndent(`
      <<<<<<< HEAD:file.adoc
      Hello world
      =======
      Goodbye
      >>>>>>> 77976da35a11db4580b80ae27e8d65caf5208086:file.adoc
    `).trim();

    const lines = adoc.split('\n');
    let results: any[] = [];
    lines.forEach((line, index) => {
      const lineResults = gitConflictMarkers(line, lines, index + 1, opts);
      results = results.concat(...lineResults);
    });

    expect(results).toHaveLength(3);
    expect(results[0]).toEqual({
      line: 1,
      column: false,
      type: 'error',
      rule: 'git-conflict-markers',
      message: 'Git conflict markers must be removed.',
    });
    expect(results[1].line).toBe(3);
    expect(results[2].line).toBe(5);
  });
});
