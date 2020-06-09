import path from 'path';
import fs from 'fs-extra';
import { Options } from './types';

export function dirs(
  opts: Pick<Options, 'namespace' | 'srcPath'>,
): { ARTIFACT_DIR: string; SRC_DIR: string } {
  const namespace = opts.namespace || `ns_auto_gen_${Date.now()}`;
  const srcPath = opts.srcPath || `src_path_auto_gen_${Date.now()}`;
  const ROOT_DIR = path.resolve(__dirname, `..`, `artifacts`);
  const ARTIFACT_DIR = path.resolve(ROOT_DIR, namespace);
  const SRC_DIR = path.resolve(ARTIFACT_DIR, `src`, srcPath);
  return { ARTIFACT_DIR, SRC_DIR };
}

export function deleteNamespaceDir(namespace: string): void {
  const { ARTIFACT_DIR } = dirs({ namespace });
  fs.removeSync(ARTIFACT_DIR);
}
