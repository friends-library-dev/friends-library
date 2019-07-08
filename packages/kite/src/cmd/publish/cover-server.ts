import { exec, execSync } from 'child_process';
import { green, log, c } from '@friends-library/cli/color';

export async function withCoverServer<T extends (...args: any[]) => any>(
  publishFn: T,
  useDevServer: boolean,
): Promise<ReturnType<T>> {
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
    log(
      c`{green.dim (Using already running cover dev server at port ${PORT.toString()})}`,
    );
  }

  const result = await publishFn();

  if (!useDevServer) {
    execSync(`lsof -t -i tcp:${PORT} | xargs kill`);
  }

  return result;
}
