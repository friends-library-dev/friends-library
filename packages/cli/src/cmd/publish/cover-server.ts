import puppeteer from 'puppeteer-core';
import { exec, execSync } from 'child_process';
import env from '@friends-library/env';
import { green } from '@friends-library/cli-utils/color';

export async function start(): Promise<number> {
  const port = 51515;
  const cwd = process.cwd();
  green('Building cover app...');
  execSync(`cd ${cwd} && yarn cover:build`);
  green('Serving cover app');
  stop(port);
  exec(`cd ${cwd}/packages/cli && yarn serve -l ${port} ../cover-web-app/build`);
  await new Promise(res => setTimeout(res, 1000));
  return port;
}

export function stop(port: number): void {
  execSync(`lsof -t -i tcp:${port} | xargs kill`);
}

interface ScreenshotTaker {
  (id: string): Promise<Buffer>;
}

interface BrowserCloser {
  (): Promise<void>;
}

export async function screenshot(
  port: number,
): Promise<[ScreenshotTaker, BrowserCloser]> {
  const { CHROMIUM_PATH } = env.require('CHROMIUM_PATH');
  const browser = await puppeteer.launch({ executablePath: CHROMIUM_PATH });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 2400 });

  return [
    async (id: string): Promise<Buffer> => {
      await page.goto(`http://localhost:${port}?capture=ebook&id=${id}`);
      return page.screenshot({ encoding: 'binary' });
    },
    async () => {
      await browser.close();
    },
  ];
}
