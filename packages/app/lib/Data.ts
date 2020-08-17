import { EventEmitter } from 'events';
import { AudioResource, UserSettings, ResumeState } from 'types';
import FS from './FileSystem';
import Network from './Network';
import { AudioQuality } from '@friends-library/types';

class Data extends EventEmitter {
  public audioResources: Map<string, AudioResource> = new Map();
  public trackPositions: Map<string, number> = new Map();
  public userSettings: UserSettings = { audioQuality: `HQ` };
  public resumeState: ResumeState = {
    lastPlayedAudio: null,
    lastPlayedPart: {},
    partPositions: {},
  };

  public async init(): Promise<void> {
    await Promise.all([
      this.initAudioResources(),
      this.initUserSettings(),
      this.initResumeState(),
    ]);
  }

  public setAudioQualityPreference(quality: AudioQuality): void {
    if (quality === this.userSettings.audioQuality) {
      return;
    }
    this.userSettings = { ...this.userSettings, audioQuality: quality };
    this.emit(`updated:user-settings`, this.userSettings);
    this.saveUserSettings();
  }

  public clearPartPosition(audioId: string, partIndex: number): Promise<void> {
    delete this.resumeState.partPositions[`${audioId}--${partIndex}`];
    return this.saveResumeState();
  }

  public setPartPosition(
    audioId: string,
    partIndex: number,
    position: number,
  ): Promise<void> {
    this.resumeState.partPositions[`${audioId}--${partIndex}`] = position;
    return this.saveResumeState();
  }

  public setLastPlayedPart(audioId: string, partIndex: number): Promise<void> {
    this.resumeState.lastPlayedPart[audioId] = partIndex;
    return this.saveResumeState();
  }

  public clearLastPlayedPart(audioId: string): Promise<void> {
    delete this.resumeState.lastPlayedPart[audioId];
    return this.saveResumeState();
  }

  public setLastPlayedAudio(audioId: string): Promise<void> {
    this.resumeState.lastPlayedAudio = audioId;
    return this.saveResumeState();
  }

  private saveResumeState(): Promise<void> {
    return FS.writeFile(`data/resume-state.json`, JSON.stringify(this.resumeState));
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

  private async initResumeState(): Promise<void> {
    if (FS.hasFile(`data/resume-state.json`)) {
      const resumeState = await FS.readJson(`data/resume-state.json`);
      if (resumeStateValid(resumeState)) {
        this.resumeState = resumeState;
        return;
      }
    }
    this.saveResumeState();
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

function resumeStateValid(state: any): state is ResumeState {
  return (
    (state.lastPlayedAudio === null || typeof state.lastPlayedAudio === `string`) &&
    state.lastPlayedPart !== null &&
    state.partPositions !== null &&
    typeof state.lastPlayedPart === `object` &&
    typeof state.partPositions === `object` &&
    state.partPositions &&
    state.lastPlayedPart &&
    Object.keys(state.lastPlayedPart).every((k) => typeof k === `string`) &&
    Object.values(state.lastPlayedPart).every((v) => typeof v === `number`) &&
    Object.keys(state.partPositions).every((k) => typeof k === `string`) &&
    Object.values(state.partPositions).every((v) => typeof v === `number`)
  );
}

function settingsValid(settings: any): settings is UserSettings {
  return typeof settings === `object` && [`HQ`, `LQ`].includes(settings.audioQuality);
}
