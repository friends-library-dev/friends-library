import prettyMilliseconds from 'pretty-ms';
import { log, c } from '@friends-library/cli/color';
import { SourceDocument } from './source';

let updateStart: number;

export function logUpdateStart(): void {
  updateStart = Date.now();
  log(c`\n{cyan Beginning asset updates at} {magenta ${new Date().toLocaleString()}}`);
}

export function logDocStart(sourceDoc: SourceDocument, progress: string): void {
  const id = getId(sourceDoc);
  log(c`{yellow  →} {gray Begin generation of assets for} ${id} ${progress}`);
}

export function logDocComplete(
  sourceDoc: SourceDocument,
  assetStart: number,
  progress: string,
): void {
  const completed = c`{green  √} {gray Completed generation of assets for}`;
  const timing = c`{magenta ${elapsed(assetStart)} (total: ${elapsed(updateStart)})}`;
  const id = getId(sourceDoc);
  log(c`${completed} ${id} {gray in} ${timing} ${progress}`);
}

export function logUpdateComplete(): void {
  const timing = c`{magenta ${elapsed(updateStart)}}`;
  log(c`\n{green ✨  Successfully completed updated process} {gray in} ${timing}\n\n`);
}

export function logResize(newSize: string, id: string): void {
  const retry = c`{gray re-trying with} {yellow ${newSize}}`;
  log(c` {red x} {gray Resizing print pdf for} {cyan ${id}} ${retry}`);
}

function getId(sourceDoc: SourceDocument): string {
  return c`{cyan ${sourceDoc.edition.path}}`;
}

function elapsed(timestamp: number): string {
  return prettyMilliseconds(Date.now() - timestamp);
}
