import RNFS, { DownloadResult } from 'react-native-fs';
import { AudioQuality } from '@friends-library/types';
import * as keys from './keys';

class FileSystem {
  public manifest: Record<string, number> = {};
  private downloads: Record<string, Promise<DownloadResult>> = {};

  public async init(): Promise<void> {
    await Promise.all([
      RNFS.mkdir(this.path(`artwork/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.path(`audio/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.path(`data/`)),
    ]);

    for (const dir of [`artwork`, `audio`, `data`]) {
      const files = await RNFS.readDir(this.path(`${dir}/`));
      files
        .filter((f) => f.isFile())
        .forEach((f) => (this.manifest[`${dir}/${basename(f.path)}`] = Number(f.size)));
    }
  }

  private path(path?: string): string {
    return `${RNFS.DocumentDirectoryPath}/__FLP_APP_FILES__${
      path ? `/${path.replace(/^\//, ``)}` : ``
    }`;
  }
}

export default new FileSystem();

function basename(path: string): string {
  return path.split(`/`).pop() || ``;
}
