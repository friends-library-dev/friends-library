import glob from 'glob';
import { getRepos, getBranchMap, getStatusGroups } from '../repos';
import * as git from '../git';

jest.mock('glob');
jest.mock('../git');

describe('getBranchMap()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('returns correct map when all on master', async () => {
    git.getCurrentBranch.mockResolvedValue('master');
    const map = await getBranchMap(['repo1', 'repo2']);
    expect(map.size).toBe(1);
    expect(map.get('master')).toEqual(['repo1', 'repo2']);
  });
});

describe('getRepos()', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    glob.sync.mockReturnValueOnce(['en/repo-1', 'en/repo-2']);
    glob.sync.mockReturnValueOnce(['es/repo-3']);
  });

  it('returns all dirs when no exclude', async () => {
    const repos = await getRepos([]);
    expect(repos).toEqual(['en/repo-1', 'en/repo-2', 'es/repo-3']);
  });

  it('returns dirs excluding single excluded', async () => {
    const repos = await getRepos(['repo-3']);
    expect(repos).toEqual(['en/repo-1', 'en/repo-2']);
  });

  it('returns dirs excluding double excluded', async () => {
    const repos = await getRepos(['repo-3', 'repo-1']);
    expect(repos).toEqual(['en/repo-2']);
  });

  it('excludes any repo path matching exclude string', async () => {
    const repos = await getRepos(['repo']);
    expect(repos).toEqual([]);
  });

  it('returns all repos if branch not specified', async () => {
    const repos = await getRepos([]);
    expect(repos).toEqual(['en/repo-1', 'en/repo-2', 'es/repo-3']);
  });

  it('returns only repos on branch specified', async () => {
    git.getCurrentBranch.mockResolvedValueOnce('master');
    git.getCurrentBranch.mockResolvedValueOnce('master');
    git.getCurrentBranch.mockResolvedValueOnce('feature-x');
    const repos = await getRepos([], 'master');
    expect(repos).toEqual(['en/repo-1', 'en/repo-2']);
  });
});


describe('getStatusGroups()', () => {
  it('separates repos into clean and dirty', async () => {
    git.isStatusClean.mockResolvedValueOnce(true);
    git.isStatusClean.mockResolvedValueOnce(false);
    git.isStatusClean.mockResolvedValueOnce(true);
    const { clean, dirty } = await getStatusGroups(['1', '2', '3']);
    expect(clean).toEqual(['1', '3']);
    expect(dirty).toEqual(['2']);
  });
});
