// @flow
/* eslint-disable max-len */
import * as React from 'react';
import {css} from 'glamor';
import {classes} from '../lib/css';
import Edition from '../classes/Edition';
import Document from '../classes/Document';
import Audio from '../classes/Audio';
import url from '../lib/url';
import Divider from './Divider';
import EmbeddedAudio from './EmbeddedAudio';
import {h1, h2} from './Typography';

const element = css`
  padding: 15px;
`;

const title = css`
  margin: 10px 0 25px;
`;

type Props = {|
  document: Document,
  edition: Edition,
|};

export default ({ document, edition }: Props) => {
  const audio = edition.audio || new Audio();

  return (
    <div className={element}>
      <div>
        <h1 className={classes(title, h1)}>
          {document.title} (audio)
        </h1>
        <h2 className={h2}>
          by <a href={url(document.friend)}>{document.friend.name}</a>
        </h2>
        <p>
          This is the audio version of {document.friend.name}&apos;s <a href={url(document)}>{document.title}</a>, read by {audio.reader}. For other formats besides audio, <a href={url(document)}>click here</a>.
        </p>
      </div>
      <Divider />
      {audio.parts.map(part => (
        <div key={part.externalIdHq}>
          <h3>{part.title}</h3>
          <EmbeddedAudio id={part.externalIdHq} title={part.title} />
        </div>
      ))}
    </div>
  );
};
