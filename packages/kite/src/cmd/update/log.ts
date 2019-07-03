import prettyMilliseconds from 'pretty-ms';
import { log, c } from '@friends-library/cli/color';
import { SourceDocument } from './handler';

export function logStart(sourceDoc: SourceDocument): void {
  const id = getId(sourceDoc);
  log(c`{yellow  →} {gray Begin generation of assets for} ${id}`);
}

export function logComplete(
  sourceDoc: SourceDocument,
  assetStart: number,
  updateStart: number,
): void {
  const timing = c`{magenta ${elapsed(assetStart)} (total: ${elapsed(updateStart)})}`;
  const id = getId(sourceDoc);
  log(c`{green  √} {gray Completed generation of assets for} ${id} {gray in} ${timing}`);
}

function getId(sourceDoc: SourceDocument): string {
  return c`{cyan ${sourceDoc.friend.lang}${sourceDoc.edition.url()}}`;
}

function elapsed(timestamp: number): string {
  return prettyMilliseconds(Date.now() - timestamp);
}
