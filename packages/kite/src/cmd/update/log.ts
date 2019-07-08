import prettyMilliseconds from 'pretty-ms';
import { log, c } from '@friends-library/cli/color';
import { SourceDocument } from './handler';

export function logDocStart(sourceDoc: SourceDocument, progress: string): void {
  const id = getId(sourceDoc);
  log(c`{yellow  →} {gray Begin generation of assets for} ${id} ${progress}`);
}

export function logDocComplete(
  sourceDoc: SourceDocument,
  assetStart: number,
  updateStart: number,
  progress: string,
): void {
  const completed = c`{green  √} {gray Completed generation of assets for}`;
  const timing = c`{magenta ${elapsed(assetStart)} (total: ${elapsed(updateStart)})}`;
  const id = getId(sourceDoc);
  log(c`${completed} ${id} {gray in} ${timing} ${progress}`);
}

export function logUpdateComplete(start: number): void {
  const timing = c`{magenta ${elapsed(start)}}`;
  log(c`\n{green ✨  Successfully completed updated process} {gray in} ${timing}\n\n`);
}

function getId(sourceDoc: SourceDocument): string {
  return c`{cyan ${sourceDoc.friend.lang}${sourceDoc.edition.url()}}`;
}

function elapsed(timestamp: number): string {
  return prettyMilliseconds(Date.now() - timestamp);
}
