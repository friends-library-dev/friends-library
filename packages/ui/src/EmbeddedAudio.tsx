import React from 'react';
import { LANG } from './env';

interface Props {
  title: string;
  trackId: number;
  playlistId?: number | null;
  showArtwork?: boolean;
  height?: number;
}

export default ({
  trackId,
  playlistId,
  showArtwork = true,
  height = 166,
  title,
}: Props) => (
  <iframe
    title={title}
    width="100%"
    height={String(height)}
    scrolling="no"
    frameBorder="no"
    src={src(trackId, playlistId, showArtwork)}
  />
);

function src(
  trackId: number,
  playlistId: number | undefined | null,
  showArtwork: boolean,
): string {
  const resource = playlistId ? 'playlists' : 'tracks';
  const id = playlistId || trackId;
  const params: Record<string, string> = {
    url: `https://api.soundcloud.com/${resource}/${id}`,
    color: LANG === 'es' ? 'C18C59' : '6C3142',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'false',
    show_reposts: 'false',
    show_artwork: showArtwork ? 'true' : 'false',
    show_teaser: 'false',
    locale: LANG,
  };

  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `https://w.soundcloud.com/player/?${query}`;
}
