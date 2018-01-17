// @flow
import * as React from 'react';
import Document from '../classes/Document';
import Edition from '../classes/Edition';
import FriendPage from '../components/FriendPage';
import DocumentPage from '../components/DocumentPage';
import AudioPage from '../components/AudioPage';
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
    const document = friend.documents.find(doc => doc.slug === docSlug) || new Document();

    return {
      props: {
        title: document.title,
      },
      children: <DocumentPage document={document} />,
    };
  },

  '/:friendSlug/:docSlug/:editionType/audio': (req: express$Request) => {
    const { params: { friendSlug, docSlug, editionType } } = req;
    const friend = getFriend(friendSlug);
    const document = friend.documents.find(doc => doc.slug === docSlug) || new Document();
    const edition = document.editions.find(e => e.type === editionType) || new Edition();

    return {
      props: {
        title: `Audio: ${document.title}`,
      },
      children: <AudioPage document={document} edition={edition} />,
    };
  }
};
