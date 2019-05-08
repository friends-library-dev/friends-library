import fs from 'fs';
import glob from 'glob';
import lintDir from '../lint-path';

jest.mock('fs');

describe('lintDir()', () => {
  beforeEach(() => {
    glob.sync = jest.fn();
  });

  it('throws if you pass a non-existent full path', () => {
    (<jest.Mock>fs.existsSync).mockReturnValue(false);
    expect(() => lintDir('/path/to/foo.adoc')).toThrowError(/does not exist/);
  });

  it('throws if the path contains no asciidoc files', () => {
    (<jest.Mock>fs.existsSync).mockReturnValue(true);
    (<jest.Mock>glob.sync).mockReturnValue([]); // <-- no files
    expect(() => lintDir('/en/george-fox/')).toThrowError(/No files/);
  });

  it('lints the globbed paths and returns map of lint data', () => {
    (<jest.Mock>fs.existsSync).mockReturnValue(true);
    (<jest.Mock>glob.sync).mockReturnValue(['/foo.adoc']);
    (<jest.Mock>fs.readFileSync).mockReturnValue({
      toString: () => '== C1\n\n® bad char\n',
    });

    const lints = lintDir('/');

    expect(lints.count()).toBe(1);

    expect(lints.toArray()).toEqual([
      [
        '/foo.adoc',
        {
          path: '/foo.adoc',
          adoc: '== C1\n\n® bad char\n',
          lints: [
            {
              type: 'error',
              rule: 'invalid-characters',
              column: 1,
              line: 3,
              message: expect.any(String),
            },
          ],
        },
      ],
    ]);
  });
});
