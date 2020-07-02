import { spawnSync } from 'child_process';
import { red } from '@friends-library/cli-utils/color';

export function ensureDockerImage(tag: string, dir: string): void {
  const opts = { cwd: dir };

  // check that we have docker installed
  if (spawnSync(`docker`, [`--version`]).status !== 0) {
    red(`Docker required to run convert command.`);
    process.exit(1);
  }

  const imageExists = spawnSync(`docker`, [`image`, `inspect`, tag], opts).status === 0;
  if (!imageExists) {
    // build an image according to specs in ./Dockerfile
    spawnSync(`docker`, [`build`, `-t`, tag, `.`], opts);
  }
}
