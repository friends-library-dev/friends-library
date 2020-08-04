import RNFS, { DownloadResult } from 'react-native-fs';

class FileSystem {
  private manifest: Map<string, number> = new Map();
  private downloads: Map<string, Promise<DownloadResult>> = new Map();

  public async init(): Promise<void> {
    await Promise.all([
      RNFS.mkdir(this.path(`artwork/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.path(`audio/`)),
      RNFS.mkdir(this.path(`settings/`)),
    ]);
    const artworkFiles = await RNFS.readDir(this.path(`artwork/`));
    artworkFiles
      .filter((f) => f.isFile())
      .forEach((f) =>
        this.manifest.set(`artwork/${basename(f.path)}`, Number(f.size)),
      );
  }

  public artworkImageUri(audioId: string, networkUrl: string): string {
    const relPath = `artwork/${audioId}.png`;
    if (this.manifest.has(relPath)) {
      return `file://${this.path(relPath)}`;
    }
    this.download(relPath, networkUrl);
    return networkUrl;
  }

  private download(relPath: string, networkUrl: string): void {
    if (this.downloads.has(relPath)) {
      return;
    }

    const { promise } = RNFS.downloadFile({
      fromUrl: networkUrl,
      toFile: this.path(relPath),
    });

    this.downloads.set(relPath, promise);

    promise.then(({ bytesWritten }) => {
      this.manifest.set(relPath, bytesWritten);
      this.downloads.delete(relPath);
    });
  }

  private path(path?: string): string {
    return `${RNFS.DocumentDirectoryPath}/__FLP_APP_FILES__${
      path ? `/${path.replace(/^\//, '')}` : ``
    }`;
  }
}

export default new FileSystem();

function basename(path: string): string {
  return path.split(`/`).pop() || ``;
}
