// @flow
import * as React from 'react';
import { getAllFriends } from '@friends-library/friends';
import { LANG } from 'env';
import Block from 'components/Block';
import PageTitle from 'components/PageTitle';
import Divider from 'components/Divider';
import Button from 'components/Button';
import url from 'lib/url';

export default () => (
  <Block>
    <PageTitle>Friends</PageTitle>

    <p><i>[We're going to need some page to list EVERY Friend, so this is that for now.  Eventually it would probably be cool to be able to sort or group these in interesting/helpful ways, display the dates, etc.]</i></p>

    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

    <Divider />

    <ul>
      {getAllFriends(LANG).map(friend => (
        <li key={friend.slug}>
          <a href={url(friend)}>
            {friend.name}
          </a>
        </li>
      ))}
    </ul>

    <Divider />

    <h2>Compilations</h2>

    <p>We also have a number of books comprised of the writings of more than one author. Some of these were compiled and published during the time of the early Quakers, and some were compiled recently by the editors of this website. Among the latter is <a href="/compilations/truth-in-the-inward-parts">Truth in the Inward Parts</a>, a work containing extracts from the journals and letters of 10 early friends describing their convincement and spiritual growth. To view compilations, click below:</p>

    <Button url="/compilations" text="See All Compilations »" />

  </Block>
);
