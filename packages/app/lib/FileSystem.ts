import { EventEmitter } from 'events';
import RNFS, { DownloadResult } from 'react-native-fs';
import Network from './Network';
import { AudioQuality } from '@friends-library/types';
import { AudioPart } from 'types';

class FileSystem extends EventEmitter {
  private manifest: Map<string, number> = new Map();
  private downloads: Map<string, Promise<DownloadResult>> = new Map();

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
        .forEach((f) => this.manifest.set(`${dir}/${basename(f.path)}`, Number(f.size)));
    }
  }

  public setOnlyListener(eventName: string, listener: (...args: any[]) => any): void {
    this.removeAllListeners(eventName);
    this.on(eventName, listener);
  }

  public async downloadAudio(
    part: AudioPart,
    quality: AudioQuality,
    onProgress: (percentComplete: number) => any = () => {},
    onComplete: (result: boolean) => any = () => {},
  ): Promise<void> {
    const path = `audio/${part.audioId}--${part.index}--${quality}.mp3`;
    if (this.downloads.has(path)) {
      return;
    }
    const url = quality === `HQ` ? part.url : part.urlLq;
    try {
      this.emit(`download:start`, part, quality);
      const { promise } = RNFS.downloadFile({
        fromUrl: url,
        toFile: this.path(path),
        begin: () => {}, // i don't seem to get progress without a `begin`
        progressInterval: 25,
        progress: ({ contentLength, bytesWritten }) => {
          const progress = (bytesWritten / contentLength) * 100;
          this.emit(`download:progress`, progress, part, quality);
          onProgress((bytesWritten / contentLength) * 100);
        },
      });
      this.downloads.set(path, promise);
      const { bytesWritten } = await promise;
      this.manifest.set(path, bytesWritten);
      onComplete(true);
      this.emit(`download:complete`, part, quality);
    } catch {
      onComplete(false);
      this.emit(`download:failed`, part, quality);
    }
    this.downloads.delete(path);
  }

  public hasAudio(part: AudioPart, quality: AudioQuality): boolean {
    const hqPath = `audio/${part.audioId}--${part.index}--HQ.mp3`;
    const lqPath = `audio/${part.audioId}--${part.index}--LQ.mp3`;
    if (quality === `HQ`) {
      return this.hasFile(hqPath);
    }
    // if we have a HQ version, that's an acceptable replacement for a
    // requested LQ version
    return this.hasFile(hqPath) || this.hasFile(lqPath);
  }

  public audioFile(part: AudioPart): string {
    const hqPath = `audio/${part.audioId}--${part.index}--HQ.mp3`;
    const lqPath = `audio/${part.audioId}--${part.index}--LQ.mp3`;
    // always use the HQ if we've got it
    if (this.hasAudio(part, `HQ`)) {
      return `file://${this.path(hqPath)}`;
    }
    return `file://${this.path(lqPath)}`;
  }

  public hasFile(path: string): boolean {
    return this.manifest.has(path);
  }

  public writeFile(
    path: string,
    contents: string,
    encoding: 'utf8' | 'ascii' | 'binary' | 'base64' = `utf8`,
  ): Promise<void> {
    const writePromise = RNFS.writeFile(
      this.path(path),
      contents,
      encoding === `binary` ? `base64` : encoding,
    );
    writePromise.then(() => this.manifest.set(path, contents.length));
    return writePromise;
  }

  public readFile(
    path: string,
    encoding: 'utf8' | 'ascii' | 'binary' | 'base64' = `utf8`,
  ): Promise<string> {
    return RNFS.readFile(this.path(path), encoding === `binary` ? `base64` : encoding);
  }

  public async readJson(path: string): Promise<any> {
    const json = await this.readFile(path);
    try {
      return JSON.parse(json);
    } catch {
      return null;
    }
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
    if (!Network.isConnected) {
      return;
    }

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
      path ? `/${path.replace(/^\//, ``)}` : ``
    }`;
  }
}

export default new FileSystem();

function basename(path: string): string {
  return path.split(`/`).pop() || ``;
}
