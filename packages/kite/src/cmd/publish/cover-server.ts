import { exec, execSync } from 'child_process';
import { green } from '@friends-library/cli/color';

export async function withCoverServer(
  publishFn: () => void,
  useDevServer: boolean,
): Promise<void> {
  const PORT = useDevServer ? 9999 : 5111;
  process.env.COVER_PORT = String(PORT);
  if (!useDevServer) {
    const cwd = process.cwd();
    green('Building cover app...');
    execSync(`cd ${cwd} && yarn cover:build`);
    green('Serving cover app');
    execSync(`lsof -t -i tcp:${PORT} | xargs kill`);
    exec(`cd ${cwd}/packages/kite && yarn serve -l ${PORT} ../cover/build`);
    await new Promise(res => setTimeout(res, 1000));
  } else {
    green(`Using already running cover dev server at port ${PORT}`);
  }

  await publishFn();

  if (!useDevServer) {
    execSync(`lsof -t -i tcp:${PORT} | xargs kill`);
  }
}
