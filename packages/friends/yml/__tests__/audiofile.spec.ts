import path from 'path';
import { safeLoad } from 'js-yaml';
import { readFileSync } from 'fs';
import { yamlGlob, audioParts } from '../test-helpers';

const files = yamlGlob(path.resolve(__dirname, '../../yml/*/*.yml'));

files.forEach(file => {
  describe(`${file.short}`, () => {
    const friend = safeLoad(readFileSync(file.path, 'utf8'));
    test('audio parts hq filesize is larger than lq', () => {
      audioParts(friend).forEach(part => {
        expect(part.filesize_hq).toBeGreaterThan(part.filesize_lq);
      });
    });
  });
});
