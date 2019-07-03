import { SourceDocument, Asset } from './handler';

export function filterByPattern(
  sourceDocs: SourceDocument[],
  pattern?: string,
): SourceDocument[] {
  if (!pattern) return sourceDocs;
  return sourceDocs.filter(sourceDoc => sourceDoc.fullPath.indexOf(pattern) !== -1);
}

export function needingUpdate(sourceDocs: SourceDocument[]): SourceDocument[] {
  return sourceDocs.filter(
    sourceDoc => sourceDocChanged(sourceDoc) || productionChanged(sourceDoc),
  );
}

function sourceDocChanged(sourceDoc: SourceDocument): boolean {
  // @TODO implement real logic
  if (sourceDoc) return true;
  return true;
}

function productionChanged(sourceDoc: SourceDocument): boolean {
  // @TODO implement real logic
  if (sourceDoc) return true;
  return true;
}

export function newCoverNeeded(asset: Asset): boolean {
  // @TODO implement real logic, compare pageg nums, etc.
  if (asset) return true;
  return true;
}
