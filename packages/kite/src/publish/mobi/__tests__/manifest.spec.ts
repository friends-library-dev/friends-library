import { createJob } from '@friends-library/asciidoc';
import { getMobiManifest } from '../manifest';

describe('getMobiManifest()', () => {
  it('should change meta charset to mobi-format', () => {
    const manifest = getMobiManifest(createJob());

    Object.keys(manifest).forEach(key => {
      expect(manifest[key]).not.toContain('<meta charset="UTF-8"/>');
    });

    const mobiMeta = '<meta http-equiv="Content-Type" content="application/xml+xhtml; charset=UTF-8"/>';
    expect(manifest['OEBPS/nav.xhtml']).toContain(mobiMeta);
  });
});
