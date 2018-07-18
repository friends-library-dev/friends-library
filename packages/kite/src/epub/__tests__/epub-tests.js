import { epub } from '../';
import { getFriend } from '@friends-library/friends';

const rebecca = getFriend('rebecca-jones');

describe('epub()', () => {

  let spec;

  beforeEach(() => {
    spec = {
      lang: 'en',
      friend: rebecca,
      document: rebecca.documents[0],
      edition: rebecca.documents[0].editions[0]
    };
  });

  it('returns a META-INF dir with required container.xml', () => {
    const manifest = epub(spec);
    expect(manifest['META-INF/container.xml']).toBeDefined();
  });

  it('has mimetype file in root', () => {
    const manifest = epub(spec);
    expect(manifest.mimetype).toBe('application/epub+zip');
  });
});
