import prettyMilliseconds from 'pretty-ms';
import { log, c } from '@friends-library/cli-utils/color';
import { DocPrecursor } from '@friends-library/types';

let updateStart: number;

export function logPublishStart(): void {
  updateStart = Date.now();
  log(c`\n{cyan Beginning asset updates at} {magenta ${new Date().toLocaleString()}}`);
}

export function logDocStart(dpc: DocPrecursor, progress: string): void {
  const id = getId(dpc);
  log(c`{yellow  →} {gray Begin generation of assets for} ${id} ${progress}`);
}

export function logDocComplete(
  dpc: DocPrecursor,
  assetStart: number,
  progress: string,
): void {
  const completed = c`{green  √} {gray Completed generation of assets for}`;
  const timing = c`{magenta ${elapsed(assetStart)} (total: ${elapsed(updateStart)})}`;
  const id = getId(dpc);
  log(c`${completed} ${id} {gray in} ${timing} ${progress}\n`);
}

export function logPublishComplete(): void {
  const timing = c`{magenta ${elapsed(updateStart)}}`;
  log(c`\n{green ✨  Successfully completed updated process} {gray in} ${timing}\n\n`);
}

export function logResize(newSize: string, id: string): void {
  const retry = c`{gray re-trying with} {yellow ${newSize}}`;
  log(c` {red x} {gray Resizing print pdf for} {cyan ${id}} ${retry}`);
}

function getId(dpc: DocPrecursor): string {
  return c`{cyan ${dpc.path}}`;
}

function elapsed(timestamp: number): string {
  return prettyMilliseconds(Date.now() - timestamp);
}
