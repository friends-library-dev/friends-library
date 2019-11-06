import fs from 'fs';
import path from 'path';
import convertHandler from '../handler';

jest.mock('@friends-library/cli-utils/color');

describe('converHandler()', () => {
  it('converts a docbook file to asciidoc', () => {
    if (!fs.existsSync('/Users/jared/msf/asciidoctor/docbookrx/LICENSE')) {
      expect(true).toBe(true);
      return;
    }

    const file = path.resolve(__dirname, './docbook.xml');
    const adoc = file.replace(/\.xml$/, '.adoc');
    fs.existsSync(adoc) && fs.unlinkSync(adoc);
    convertHandler({ file, skipRefs: false });

    expect(fs.existsSync(adoc)).toBe(true);
    expect(fs.readFileSync(adoc).toString()).toBe('\nTesting, 1, 2, 3.');

    fs.unlinkSync(adoc);
  });
});
