import { EventEmitter } from 'events';
import { AudioResource } from 'types';
import FS from './FileSystem';
import Network from './Network';

class Data extends EventEmitter {
  public audioResources: Map<string, AudioResource> = new Map();

  public async init(): Promise<void> {
    if (FS.hasFile(`audio/resources.json`)) {
      const resources = await FS.readJson(`audio/resources.json`);
      if (resourcesValid(resources)) {
        this.audioResources = new Map(resources.map((r) => [r.id, r]));
        this.emit(`updated:audio-resources`, this.audioResources);
      }
    }

    if (!Network.isConnected) {
      return;
    }

    try {
      const res = await fetch(`https://api.friendslibrary.com/app-audios`);
      const resources = (await res.json()) as AudioResource[];
      if (resourcesValid(resources)) {
        this.audioResources = new Map(resources.map((r) => [r.id, r]));
        this.emit(`updated:audio-resources`, this.audioResources);
        FS.writeFile(`audio/resources.json`, JSON.stringify(resources));
      }
    } catch {
      // ¯\_(ツ)_/¯
    }
  }
}

export default new Data();

function resourcesValid(resources: any): resources is AudioResource[] {
  return (
    Array.isArray(resources) &&
    resources.every((r) => {
      return typeof r.artwork === `string` && Array.isArray(r.parts);
    })
  );
}
