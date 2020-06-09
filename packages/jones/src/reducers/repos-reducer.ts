import { createReducer } from 'redux-starter-kit';
import { Repo } from '../type';

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
}

export default createReducer([], {
  RECEIVE_FRIEND_REPOS: (
    state: Repo[],
    { payload: repos }: { payload: GitHubRepo[] },
  ) => {
    return repos.map(repo => ({
      id: repo.id,
      slug: repo.name,
      friendName:
        repo.name === `compilations` || repo.name === `compilaciones`
          ? repo.name.replace(/^c/, `C`)
          : repo.description.replace(/^.. ([\w .]+)( \(.*?\))? source documents$/, `$1`),
    }));
  },
});
