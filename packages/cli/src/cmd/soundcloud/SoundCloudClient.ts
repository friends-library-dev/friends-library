import fs from 'fs';
import path from 'path';
import fetch, { Response } from 'node-fetch';
import querystring from 'querystring';
import FormData from 'form-data';

interface Config {
  username: string;
  password: string;
  clientId: string;
  clientSecret: string;
}

interface Track {
  title: string;
  description: string;
  audioPath: string;
  imagePath: string;
  tags: string[];
}

interface Playlist {
  title: string;
  description: string;
  tracks: number[];
  tags: string[];
}

export default class SoundCloudClient {
  private token = '';

  public constructor(private config: Config) {}

  public async getTrack(trackId: number): Promise<null | Record<string, any>> {
    if (!this.token) await this.getToken();
    const res = await fetch(this.endpoint(`tracks/${trackId}?oauth_token=${this.token}`));
    if (res.status === 404) {
      return null;
    }
    if (res.status >= 300) {
      throw new Error(`Error getting track: ${trackId}`);
    }
    return await res.json();
  }

  public async setPlaylistTracks(
    playlistId: number,
    trackIds: number[],
  ): Promise<boolean> {
    const body = {
      playlist: {
        tracks: trackIds.map(id => ({ id })),
      },
    };

    const res = await this.sendJson(`playlists/${playlistId}`, body, 'PUT');
    if (res.status >= 300) {
      throw new Error('Error setting playlist tracks');
    }
    return true;
  }

  public async setTrackArtwork(trackId: number, imagePath: string): Promise<boolean> {
    if (!this.token) await this.getToken();

    const fd = new FormData();
    fd.append('oauth_token', this.token);
    fd.append('track[artwork_data]', fs.createReadStream(imagePath));

    const res = await fetch(this.endpoint(`tracks/${trackId}`), {
      method: 'put',
      body: fd,
    });

    if (res.status >= 300) {
      throw new Error('Error setting track artwork');
    }
    return true;
  }

  public async setPlaylistArtwork(
    playlistId: number,
    imagePath: string,
  ): Promise<boolean> {
    if (!this.token) await this.getToken();

    const fd = new FormData();
    fd.append('oauth_token', this.token);
    fd.append('playlist[artwork_data]', fs.createReadStream(imagePath));

    const res = await fetch(this.endpoint(`playlists/${playlistId}`), {
      method: 'put',
      body: fd,
    });

    if (res.status >= 300) {
      throw new Error('Error setting playlist artwork');
    }
    return true;
  }

  public async createPlaylist(playlist: Playlist): Promise<number> {
    const res = await this.sendJson('playlists', {
      playlist: {
        title: playlist.title,
        tracks: playlist.tracks.map(id => ({ id })),
        tag_list: playlist.tags.join(' '),
        description: playlist.description,
        label_name: 'Friends Library Publishing',
        genre: 'sermon',
        sharing: 'public',
        embeddable_by: 'all',
      },
    });

    if (res.status >= 300) {
      throw new Error('Error creating soundcloud playlist');
    }
    const json = await res.json();
    return json.id;
  }

  public async updateTrackAttrs(
    trackId: number,
    attrs: Record<string, string>,
  ): Promise<Record<string, any>> {
    if (!this.token) await this.getToken();

    const res = await this.sendJson(`tracks/${trackId}`, { track: attrs }, 'PUT');
    if (res.status >= 300) {
      throw new Error('Error updating track attributes');
    }
    return await res.json();
  }

  public async uploadTrack(track: Track): Promise<number> {
    if (!this.token) await this.getToken();

    const fd = new FormData();
    fd.append('oauth_token', this.token);
    fd.append('track[title]', track.title);
    fd.append('track[asset_data]', fs.createReadStream(track.audioPath));
    fd.append('track[artwork_data]', fs.createReadStream(track.imagePath));
    fd.append('track[original_filename]', path.basename(track.audioPath));
    fd.append('track[sharing]', 'public');
    fd.append('track[embeddable_by]', 'all');
    fd.append('track[track_type]', 'spoken');
    fd.append('track[label_name]', 'Friends Library Publishing');
    fd.append('track[genre]', 'sermon');
    fd.append('track[commentable]', 'false');
    fd.append('track[description]', track.description);
    fd.append('track[downloadable]', 'true');
    if (track.tags.length) {
      fd.append('track[tag_list]', track.tags.join(' '));
    }

    const res = await fetch(this.endpoint('tracks'), {
      method: 'post',
      body: fd,
    });

    if (res.status >= 300) {
      throw new Error('Error uploading soundcloud track');
    }
    const json = await res.json();
    return json.id;
  }

  private async sendJson(
    path: string,
    body: Record<string, any>,
    method: 'POST' | 'PUT' = 'POST',
  ): Promise<Response> {
    if (!this.token) await this.getToken();

    const authQuery = querystring.stringify({
      oauth_token: this.token,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    return fetch(this.endpoint(`${path}?${authQuery}`), {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
  }

  private async getToken(): Promise<void> {
    const res = await this.postForm('oauth2/token', {
      grant_type: 'password',
      scope: 'non-expiring',
      username: this.config.username,
      password: this.config.password,
      client_id: this.config.clientId,
      client_secret: this.config.clientSecret,
    });

    if (res.status >= 300) {
      console.log(res);
      throw new Error('Error acquiring soundcloud access token');
    }
    const json = await res.json();
    this.token = json.access_token;
  }

  private postForm(path: string, params: Record<string, any>): Promise<Response> {
    return fetch(this.endpoint(path), {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: querystring.stringify(params),
    });
  }

  private endpoint(path: string): string {
    return `https://api.soundcloud.com/${path}`;
  }
}
