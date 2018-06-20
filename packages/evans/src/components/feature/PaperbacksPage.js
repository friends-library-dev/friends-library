// @flow
import * as React from 'react';
import Block from 'components/Block';
import PageTitle from 'components/PageTitle';
import Divider from 'components/Divider';
import url from 'lib/url';
import { getAllFriends } from 'server/helpers';

// @TODO make this better, more functional
const paperbacks = [];
getAllFriends().forEach((friend) => {
  friend.documents.filter(doc => doc.hasAudio()).forEach((doc) => {
    doc.editions.forEach((ed) => {
      ed.formats.filter(format => format.type === 'softcover').forEach((format) => {
        paperbacks.push(format);
      });
    });
  });
});

export default () => (
  <Block>
    <PageTitle>Paperbacks</PageTitle>

    <p><i>[The idea behind this page is a one-stop location to find every book that we currently have the ability to print/ship a paperback for. This seems like it might be useful for a while until we can build the complete end-to-end system of ordering paperbacks of any book on the site.]</i></p>

    <p>Below is a list of every book that is currently available in a paperback edition. We are working towards the goal of making every book on the site available in paperback, so if you don't see the book you're interested listed here, check back soon!</p>

    <p>Click one of the links below for details on how to order a paperback copy.</p>

    <Divider />

    <ul>
      {paperbacks.map(audio => (
        <li key={audio.edition.document.slug}>
          <a href={url(audio)}>
            {audio.edition.document.friend.name}: {audio.edition.document.title}
          </a>
        </li>
      ))}
    </ul>

  </Block>
);
