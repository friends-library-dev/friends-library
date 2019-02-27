import lintCheck from '../lint';
import { prTestSetup } from '../../__tests__/helpers';

describe('lintCheck()', () => {
  let github;
  let context;
  let files;

  beforeEach(() => {
    [context, github] = prTestSetup();
    files = [{
      path: '01.adoc',
      adoc: '== Ch 1\n',
    }];
  });

  it('creates an in_progress check for linting', async () => {
    await lintCheck(context, files);
    expect(github.checks.create.mock.calls[0][0]).toMatchObject({
      status: 'in_progress',
      name: 'lint-asciidoc',
      repo: 'jane-doe',
      owner: 'friends-library-sandbox',
    });
  });

  it('passes the check if no lint annotations', async () => {
    await lintCheck(context, files);
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'success',
    });
  });

  it('fails the check if lint annotations', async () => {
    files[0].adoc = "== Ch 1\n\n'`Tis thou!\n"; // bad asciidoc, will be linted
    await lintCheck(context, files);
    const update = github.checks.update.mock.calls[0][0];
    expect(update).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'failure',
      output: {
        annotations: expect.any(Array),
      },
    });
    expect(update.output.annotations).toHaveLength(1);
  });
});
