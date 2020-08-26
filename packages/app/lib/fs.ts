import RNFS from 'react-native-fs';
import { AudioQuality } from '@friends-library/types';
import * as keys from './keys';

class FileSystem {
  public async init(): Promise<void> {
    await Promise.all([
      RNFS.mkdir(this.path(`artwork/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.path(`audio/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.path(`data/`)),
    ]);
  }

  public hasAudio(
    audioId: string,
    partIndex: number,
    quality: AudioQuality,
  ): Promise<boolean> {
    const path = this.path(
      `audio/${keys.partWithQuality(audioId, partIndex, quality)}.mp3`,
    );
    return RNFS.exists(path);
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
