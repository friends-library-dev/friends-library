// @flow
import * as React from 'react';
import Block from 'components/Block';
import PageTitle from 'components/PageTitle';
import Footer from 'components/Footer';
import Divider from 'components/Divider';
import url from 'lib/url';
import { getAllFriends } from 'server/helpers';

export default () => (
  <React.Fragment>
    <Block>
      <PageTitle>Friends</PageTitle>

      <p><i>[We're going to need some page to list EVERY Friend, so this is that for now.  Eventually it would probably be cool to be able to sort or group these in interesting/helpful ways, display the dates, etc.]</i></p>

      <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>

      <Divider />

      <ul>
        {getAllFriends().map(friend => (
          <li key={friend.slug}>
            <a href={url(friend)}>
              {friend.name}
            </a>
          </li>
        ))}
      </ul>

    </Block>
    <Footer />
  </React.Fragment>
);
