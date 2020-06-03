import { latestCommitSha } from '../pull-requests';

console.log(latestCommitSha());
console.log(process.env.GITHUB_SHA);
