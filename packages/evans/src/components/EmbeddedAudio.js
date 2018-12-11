// @flow
import * as React from 'react';

function src(id: number): string {
  const params = {
    url: `https://api.soundcloud.com/tracks/${id}`,
    color: 'ff5500',
    auto_play: 'false',
    hide_related: 'true',
    show_comments: 'false',
    show_user: 'false',
    show_reposts: 'false',
    show_artwork: 'false',
  };

  const query = Object.keys(params)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  return `https://w.soundcloud.com/player/?${query}`;
}

type Props = {|
  title: string,
  id: number,
|};

export default ({ id, title }: Props) => (
  <iframe
    title={title}
    width="100%"
    height="166"
    scrolling="no"
    frameBorder="no"
    src={src(id)}
  />
);
