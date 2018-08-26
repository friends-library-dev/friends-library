// @flow
import * as React from 'react';
import { getFriend, query } from '@friends-library/friends';
import { setLocale } from '../lib/i18n';
import { LANG } from '../env';
import FriendPage from '../components/FriendPage';
import DocumentPage from '../components/DocumentPage';
import PaperbackPage from '../components/PaperbackPage';
import AudioPage from '../components/AudioPage';
import HomePage from '../components/HomePage';
import {
  AboutPage,
  ModernizationPage,
  QuakersPage,
  AudioHelpPage,
  EbookHelpPage,
  EditionsPage,
  ContactPage,
} from '../components/static';
import {
  FriendsPage,
  AudiobooksPage,
  PaperbacksPage,
  GettingStartedPage,
  ExplorePage,
} from '../components/feature';

setLocale();

type RouteSpec = {|
  props: {
    title: string,
  },
  children: React.Node,
|};

const renderFriendPage = (req: express$Request): RouteSpec => {
  const { params: { slug } } = req;
  const friend = getFriend(slug || 'compilations', LANG);

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
  '/compilations': renderFriendPage,

  '/:friendSlug/:docSlug': (req: express$Request): RouteSpec => {
    const { params: { friendSlug, docSlug } } = req;
    const { document } = query(LANG, friendSlug, docSlug);

    return {
      props: {
        title: document.title,
      },
      children: <DocumentPage document={document} />,
    };
  },

  '/:friendSlug/:docSlug/:editionType/audio': (req: express$Request): RouteSpec => {
    const { params: { friendSlug, docSlug, editionType } } = req;
    const { document, edition } = query(LANG, friendSlug, docSlug, editionType);

    return {
      props: {
        title: `Audio: ${document.title}`,
      },
      children: <AudioPage document={document} edition={edition} />,
    };
  },

  '/:friendSlug/:docSlug/:editionType/paperback': (req: express$Request): RouteSpec => {
    const { params: { friendSlug, docSlug, editionType } } = req;
    const { document } = query(LANG, friendSlug, docSlug, editionType);

    return {
      props: {
        title: `Paperback: ${document.title}`,
      },
      children: <PaperbackPage document={document} />,
    };
  },

  '/about': (): RouteSpec => {
    return {
      props: {
        title: 'About the Friends Library',
      },
      children: <AboutPage />,
    };
  },

  '/modernization': (): RouteSpec => {
    return {
      props: {
        title: 'Information about modernization',
      },
      children: <ModernizationPage />,
    };
  },

  '/friends': (): RouteSpec => {
    return {
      props: {
        title: 'Friends',
      },
      children: <FriendsPage />,
    };
  },

  '/quakers': (): RouteSpec => {
    return {
      props: {
        title: 'About Quakers',
      },
      children: <QuakersPage />,
    };
  },

  '/audio-help': (): RouteSpec => {
    return {
      props: {
        title: 'Audio Help',
      },
      children: <AudioHelpPage />,
    };
  },

  '/ebook-help': (): RouteSpec => {
    return {
      props: {
        title: 'E-book Help',
      },
      children: <EbookHelpPage />,
    };
  },

  '/editions': (): RouteSpec => {
    return {
      props: {
        title: 'About book editions',
      },
      children: <EditionsPage />,
    };
  },

  '/contact': (): RouteSpec => {
    return {
      props: {
        title: 'Contact Us',
      },
      children: <ContactPage />,
    };
  },

  '/audiobooks': (): RouteSpec => {
    return {
      props: {
        title: 'Audiobooks',
      },
      children: <AudiobooksPage />,
    };
  },

  '/paperbacks': (): RouteSpec => {
    return {
      props: {
        title: 'Paperbacks',
      },
      children: <PaperbacksPage />,
    };
  },

  '/getting-started': (): RouteSpec => {
    return {
      props: {
        title: 'Getting Started',
      },
      children: <GettingStartedPage />,
    };
  },

  '/explore': (): RouteSpec => {
    return {
      props: {
        title: 'Explore Books',
      },
      children: <ExplorePage />,
    };
  },
};

export default routes;
