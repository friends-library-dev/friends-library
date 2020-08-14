import { EventEmitter } from 'events';
import { AudioResource, UserSettings } from 'types';
import FS from './FileSystem';
import Network from './Network';
import { AudioQuality } from '@friends-library/types';

class Data extends EventEmitter {
  public audioResources: Map<string, AudioResource> = new Map();
  public userSettings: UserSettings = { audioQuality: `HQ` };

  public async init(): Promise<void> {
    await Promise.all([this.initAudioResources(), this.initUserSettings()]);
  }

  public setAudioQualityPreference(quality: AudioQuality): void {
    if (quality === this.userSettings.audioQuality) {
      return;
    }
    this.userSettings = { ...this.userSettings, audioQuality: quality };
    this.emit(`updated:user-settings`, this.userSettings);
    this.saveUserSettings();
  }

  private saveUserSettings(): Promise<void> {
    return FS.writeFile(`data/user-settings.json`, JSON.stringify(this.userSettings));
  }

  private async initUserSettings(): Promise<void> {
    if (FS.hasFile(`data/user-settings.json`)) {
      const settings = await FS.readJson(`data/user-settings.json`);
      if (settingsValid(settings)) {
        this.userSettings = settings;
        this.emit(`updated:user-settings`, settings);
      }
    } else {
      FS.writeFile(`data/user-settings.json`, JSON.stringify(this.userSettings));
    }
  }

  private async initAudioResources(): Promise<void> {
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

function settingsValid(settings: any): settings is UserSettings {
  return typeof settings === `object` && [`HQ`, `LQ`].includes(settings.audioQuality);
}
