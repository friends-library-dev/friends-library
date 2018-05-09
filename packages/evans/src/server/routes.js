// @flow
import * as React from 'react';
import { setLocale } from 'lib/i18n';
import FriendPage from 'components/FriendPage';
import DocumentPage from 'components/DocumentPage';
import SoftcoverPage from 'components/SoftcoverPage';
import AudioPage from 'components/AudioPage';
import HomePage from 'components/HomePage';
import { getFriend, query } from './helpers';

setLocale();

type RouteSpec = {|
  props: {
    title: string,
  },
  children: React.Node,
|};

const renderFriendPage = (req: express$Request): RouteSpec => {
  const { params: { slug } } = req;
  const friend = getFriend(slug);

  return {
    props: {
      title: friend.name,
    },
    children: <FriendPage friend={friend} />,
  };
};

const routes: { [string]: (req: express$Request) => RouteSpec } = {
  '/': (): RouteSpec => ({
    props: {
      title: 'Home',
    },
    children: <HomePage />,
  }),

  '/friend/:slug': renderFriendPage,
  '/amigo/:slug': renderFriendPage,
  '/amiga/:slug': renderFriendPage,

  '/:friendSlug/:docSlug': (req: express$Request): RouteSpec => {
    const { params: { friendSlug, docSlug } } = req;
    const { document } = query(friendSlug, docSlug);

    return {
      props: {
        title: document.title,
      },
      children: <DocumentPage document={document} />,
    };
  },

  '/:friendSlug/:docSlug/:editionType/audio': (req: express$Request): RouteSpec => {
    const { params: { friendSlug, docSlug, editionType } } = req;
    const { document, edition } = query(friendSlug, docSlug, editionType);

    return {
      props: {
        title: `Audio: ${document.title}`,
      },
      children: <AudioPage document={document} edition={edition} />,
    };
  },

  '/:friendSlug/:docSlug/:editionType/softcover': (req: express$Request): RouteSpec => {
    const { params: { friendSlug, docSlug, editionType } } = req;
    const { document } = query(friendSlug, docSlug, editionType);

    return {
      props: {
        title: `Softcover: ${document.title}`,
      },
      children: <SoftcoverPage document={document} />,
    };
  },
};

export default routes;
