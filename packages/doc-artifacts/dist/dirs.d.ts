import { Options } from './types';
export declare function dirs(opts: Pick<Options, 'namespace' | 'srcPath'>): {
    ARTIFACT_DIR: string;
    SRC_DIR: string;
};
export declare function deleteNamespaceDir(namespace: string): void;
