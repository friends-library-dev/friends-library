// @flow
import * as React from 'react';
import FriendPage from '../components/FriendPage';
import DocumentPage from '../components/DocumentPage';
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
  },
  '/:friendSlug/:docSlug': (req: express$Request) => {
    const { params: { friendSlug, docSlug } } = req;
    const friend = getFriend(friendSlug);
    const document = friend.documents.find(doc => doc.slug === docSlug);
    if (!document) {
      return;
    }

    return {
      props: {
        title: document.title,
      },
      children: <DocumentPage document={document} />,
    };
  }
};
