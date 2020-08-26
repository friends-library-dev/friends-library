import { AudioResource } from 'types';

export default class Service {
  public static async loadAudios(): Promise<AudioResource[] | null> {
    //
    return null;
  }

  public static async fetchAudios(): Promise<AudioResource[] | null> {
    try {
      const res = await fetch(`https://api.friendslibrary.com/app-audios`);
      const resources = await res.json();
      if (resourcesValid(resources)) {
        return resources;
      }
    } catch (err) {
      return null;
    }
    return null;
  }
}

function resourcesValid(resources: any): resources is AudioResource[] {
  return (
    Array.isArray(resources) &&
    resources.every((r) => {
      return typeof r.artwork === `string` && Array.isArray(r.parts);
    })
  );
}
