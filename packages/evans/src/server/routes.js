// @flow
import * as React from 'react';
import FriendPage from '../components/FriendPage';
import { getFriend } from './helpers';

export default {
  '/': () => ({
    props: {
      title: 'Home',
    },
    children: <h1>Home goes here</h1>

  }),
  '/friend/:slug': (req: express$Request) => {
    const { params: { slug } } = req;
    const friend = getFriend(slug);

    return {
      props: {
        title: friend.name,
      },
      children: <FriendPage friend={friend} />,
    };
  }
};
