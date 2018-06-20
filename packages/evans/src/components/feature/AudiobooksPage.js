// @flow
import * as React from 'react';
import Block from 'components/Block';
import PageTitle from 'components/PageTitle';
import Divider from 'components/Divider';
import url from 'lib/url';
import { getAllFriends } from 'server/helpers';

// @TODO make this better, more functional
const audios = [];
getAllFriends().forEach((friend) => {
  friend.documents.filter(doc => doc.hasAudio()).forEach((doc) => {
    doc.editions.forEach((ed) => {
      ed.formats.filter(format => format.type === 'audio').forEach((format) => {
        audios.push(format);
      });
    });
  });
});

export default () => (
  <Block>
    <PageTitle>Audiobooks</PageTitle>

    <p><i>[The idea behind this page is a one-stop location to find every book that we currently have audio for. It's possible (likely?) that as we expand the amount of audiobooks more and more, the utility of this page will diminish, and we might at some point no longer need it.]</i></p>

    <p>Below is a list of every book for which we currently have a completed audiobook edition. Check back often as we're frequently adding new recordings!</p>

    <Divider />

    <ul>
      {audios.map(audio => (
        <li key={audio.edition.document.slug}>
          <a href={url(audio)}>
            {audio.edition.document.friend.name}: {audio.edition.document.title}
          </a>
        </li>
      ))}
    </ul>

  </Block>
);
