import { Asset } from './handler';
import { SourceDocument } from './source';

export function needingUpdate(sourceDoc: SourceDocument): boolean {
  return sourceDocChanged(sourceDoc) || productionChanged(sourceDoc);
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
