import { getHandler } from '..';
import * as adocPr from '../adoc-pr';

describe('getHandler()', () => {
  it('returns adocPr.handleNewCommit() when friend PR opened', () => {
    const payload = {
      action: 'opened',
      repository: {
        name: 'george-fox',
      },
    };
    const handler = getHandler('pull_request', payload);
    expect(handler).toBe(adocPr.handleNewCommit);
  });

  it('returns adocPr.handleClose() when friend PR closed', () => {
    const payload = {
      action: 'closed',
      repository: {
        name: 'george-fox',
      },
    };
    const handler = getHandler('pull_request', payload);
    expect(handler).toBe(adocPr.handleClose);
  });

  test('monorepo commits not handled by adocPr.handleNewCommit', () => {
    const payload = {
      action: 'opened',
      repository: {
        name: 'friends-library',
      },
    };
    const handler = getHandler('pull_request', payload);
    expect(handler).not.toBe(adocPr.handleNewCommit);
  });
});
