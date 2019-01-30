import { getHandler } from '../';
import { adocPrCommitHandler } from '../adoc-pr';

describe('getHandler()', () => {
  it('returns adocPrCommitHandler() when friend PR opened', () => {
    const payload = {
      action: "opened",
      repository: {
        name: 'george-fox',
      }
    }
    const handler = getHandler('pull_request', payload);
    expect(handler).toBe(adocPrCommitHandler);
  });

  test('monorepo commits not handled by adocPrCommitHandler', () => {
    const payload = {
      action: "opened",
      repository: {
        name: 'friends-library',
      }
    }
    const handler = getHandler('pull_request', payload);
    expect(handler).not.toBe(adocPrCommitHandler);
  });
});
