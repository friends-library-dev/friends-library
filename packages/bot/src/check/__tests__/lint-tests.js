import lintCheck from '../lint';
import { getLintAnnotations } from '../../lint-adoc';
import { prTestSetup } from '../../__tests__/helpers';

jest.mock('../../lint-adoc');

describe('lintCheck()', () => {
  let github;
  let context;
  let files;

  beforeEach(() => {
    [context, github] = prTestSetup();
    files = [{
      path: '01.adoc',
      adoc: '== Ch 1',
    }];
    getLintAnnotations.mockReturnValue([]);
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

  it('passes modified files off to linter', async () => {
    await lintCheck(context, files);
    expect(getLintAnnotations).toHaveBeenCalledWith([{
      path: '01.adoc',
      adoc: '== Ch 1',
    }]);
  });

  it('passes the check if no lint annotations', async () => {
    getLintAnnotations.mockReturnValueOnce([]);
    await lintCheck(context, files);
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'success',
    });
  });

  it('fails the check if lint annotations', async () => {
    getLintAnnotations.mockReturnValueOnce(['foo']);
    await lintCheck(context, files);
    expect(github.checks.update.mock.calls[0][0]).toMatchObject({
      check_run_id: 1,
      status: 'completed',
      conclusion: 'failure',
      output: {
        annotations: ['foo'],
      },
    });
  });
});
