import RNFS from 'react-native-fs';

class FileSystem {
  public manifest: Record<string, number> = {};
  private downloads: Record<string, Promise<number | null>> = {};

  public async init(): Promise<void> {
    await Promise.all([
      RNFS.mkdir(this.abspath(`artwork/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.abspath(`audio/`), { NSURLIsExcludedFromBackupKey: true }),
      RNFS.mkdir(this.abspath(`data/`)),
    ]);

    for (const dir of [`artwork`, `audio`, `data`]) {
      const files = await RNFS.readDir(this.abspath(`${dir}/`));
      files
        .filter((f) => f.isFile())
        .forEach((f) => (this.manifest[`${dir}/${basename(f.path)}`] = Number(f.size)));
    }
  }

  public download(relPath: string, networkUrl: string): Promise<number | null> {
    if (this.downloads[relPath]) {
      return this.downloads[relPath];
    }

    const { promise } = RNFS.downloadFile({
      fromUrl: networkUrl,
      toFile: this.abspath(relPath),
    });

    this.downloads[relPath] = promise
      .then(({ bytesWritten }) => {
        this.manifest[relPath] = bytesWritten;
        delete this.downloads[relPath];
        return bytesWritten;
      })
      .catch(() => null);

    return this.downloads[relPath];
  }

  public async deleteAll(): Promise<void> {
    const promises = Object.keys(this.manifest).map((path) => {
      RNFS.unlink(this.abspath(path)).then(() => delete this.manifest[path]);
    });
    await Promise.all(promises);
  }

  public readFile(
    path: string,
    encoding: 'utf8' | 'ascii' | 'binary' | 'base64' = `utf8`,
  ): Promise<string> {
    return RNFS.readFile(this.abspath(path), encoding === `binary` ? `base64` : encoding);
  }

  public writeFile(
    path: string,
    contents: string,
    encoding: 'utf8' | 'ascii' | 'binary' | 'base64' = `utf8`,
  ): Promise<void> {
    const writePromise = RNFS.writeFile(
      this.abspath(path),
      contents,
      encoding === `binary` ? `base64` : encoding,
    );
    writePromise.then(() => (this.manifest[path] = contents.length));
    return writePromise;
  }

  public async readJson(path: string): Promise<any> {
    const json = await this.readFile(path);
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
  }

  public abspath(path?: string): string {
    return `${RNFS.DocumentDirectoryPath}/__FLP_APP_FILES__${
      path ? `/${path.replace(/^\//, ``)}` : ``
    }`;
  }
}

export default new FileSystem();

function basename(path: string): string {
  return path.split(`/`).pop() || ``;
}
