// @flow
import * as React from 'react';
import { Edition, Document, Audio } from 'classes';
import url from 'lib/url';
import Divider from './Divider';
import EmbeddedAudio from './EmbeddedAudio';
import PageTitle from './PageTitle';
import ByLine from './ByLine';
import Block from './Block';

type Props = {|
  document: Document,
  edition: Edition,
|};

export default ({ document, edition }: Props) => {
  const audio: Audio = edition.audio || new Audio();

  return (
    <Block>
      <div>
        <PageTitle>{document.title} (audio)</PageTitle>
        <ByLine document={document} />
        <p>
          This is the audiobook version of {document.isCompilation() ? '' : `${document.friend.name}'s:`} <a href={url(document)}>{document.title}</a>, read by {audio.reader}. For other formats besides audio, <a href={url(document)}>click here</a>.
        </p>
        <p><a href={url(audio)}>Download as podcast.</a></p>
      </div>
      <Divider />
      {audio.parts.map(part => (
        <div key={part.externalIdHq}>
          <h3>{part.title}</h3>
          <EmbeddedAudio id={part.externalIdHq} title={part.title} />
        </div>
      ))}
    </Block>
  );
};
