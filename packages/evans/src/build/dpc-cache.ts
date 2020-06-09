import fs from 'fs';
import { Heading, DocPrecursor } from '@friends-library/types';
import { NODE_ENV } from '../env';

export interface EditionCache {
  headings: Heading[];
  customCode: DocPrecursor['customCode'];
}

export function getDpcCache(): Map<string, EditionCache> {
  const cache: Map<string, EditionCache> = new Map();
  if (NODE_ENV !== `development`) {
    return cache;
  }

  if (!fs.existsSync(CACHE_PATH)) {
    return cache;
  }

  const stored = JSON.parse(fs.readFileSync(CACHE_PATH).toString());
  for (const [path, edCache] of stored) {
    cache.set(path, edCache);
  }

  return cache;
}

export function persistDpcCache(dpcCache: Map<string, EditionCache>): void {
  if (NODE_ENV === `development`) {
    fs.writeFileSync(CACHE_PATH, JSON.stringify([...dpcCache], null, 2));
  }
}

const CACHE_PATH = `${__dirname}/.dpc-cache.json`;
