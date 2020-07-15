import React from 'react';
import { storiesOf } from '@storybook/react';
import NewsFeedIcon from '../src/pages/home/news-feed/NewsFeedIcon';
import NewsFeedItem from '../src/pages/home/news-feed/NewsFeedItem';
import NewsFeedYear from '../src/pages/home/news-feed/NewsFeedYear';
import NewsFeed from '../src/pages/home/news-feed/NewsFeed';
import NewsFeedBlock from '../src/pages/home/news-feed/NewsFeedBlock';

// @ts-ignore
import Books11 from '../src/images/Books11.jpg';

storiesOf(`Newsfeed`, module)
  .add(`Icons`, () => (
    <div className="bg-flgray-100 p-4 rounded-md flex justify-around w-64">
      <NewsFeedIcon type="book" />
      <NewsFeedIcon type="audiobook" />
      <NewsFeedIcon type="spanish_translation" />
      <NewsFeedIcon type="feature" />
      <NewsFeedIcon type="chapter" />
    </div>
  ))
  .add(`NewsFeedItem`, () => (
    <NewsFeedItem
      type="book"
      url="/"
      month="Aug"
      day="10"
      title="The Journal of Jane Johnson"
      description="The Journal of Jane Johnson now available to download or purchase."
    />
  ))
  .add(`NewsFeedYear`, () => (
    <NewsFeedYear
      year="2020"
      items={[
        {
          type: `book`,
          url: `/`,
          month: `Aug`,
          day: `10`,
          title: `The Journal of Jane Johnson`,
          description: `The Journal of Jane Johnson now available to download or purchase.`,
        },
        {
          type: `audiobook`,
          url: `/`,
          month: `Jul`,
          day: `8`,
          title: `The Writings of Ambrose Rigge`,
          description: `The Writings of Ambrose Rigge now available in listening format.`,
        },
        {
          type: `chapter`,
          url: `/`,
          month: `Jun`,
          day: `15`,
          title: `The Journal of Ann Branson &mdash; Chapter II (Spanish)`,
          description: `The Journal of Ann Banson Chapter II now available in Spanish.`,
        },
        {
          type: `spanish_translation`,
          url: `/`,
          month: `May`,
          day: `7`,
          title: `The Goblet of Fire &mdash; Spanish Translation`,
          description: `Spanish translation now available on the Spanish Friends site!`,
        },
        {
          type: `feature`,
          url: `/`,
          month: `Apr`,
          day: `2`,
          title: `Friends Library App`,
          description: `The Friends Library App for iPhone and Android is now available!`,
        },
      ]}
    />
  ))
  .add(`NewsFeed (one year)`, () => (
    <div className="p-8 bg-black">
      <NewsFeed
        items={[
          {
            type: `book`,
            url: `/`,
            month: `Aug`,
            day: `10`,
            title: `The Journal of Jane Johnson`,
            description: `The Journal of Jane Johnson now available to download or purchase.`,
            year: `2020`,
          },
          {
            type: `audiobook`,
            url: `/`,
            month: `Jul`,
            day: `8`,
            title: `The Writings of Ambrose Rigge`,
            description: `The Writings of Ambrose Rigge now available in listening format.`,
            year: `2020`,
          },
          {
            type: `chapter`,
            url: `/`,
            month: `Jun`,
            day: `15`,
            title: `The Journal of Ann Branson &mdash; Chapter II (Spanish)`,
            description: `The Journal of Ann Banson Chapter II now available in Spanish.`,
            year: `2020`,
          },
          {
            type: `spanish_translation`,
            url: `/`,
            month: `May`,
            day: `7`,
            title: `The Goblet of Fire &mdash; Spanish Translation`,
            description: `Spanish translation now available on the Spanish Friends site!`,
            year: `2020`,
          },
          {
            type: `feature`,
            url: `/`,
            month: `Apr`,
            day: `2`,
            title: `Friends Library App`,
            description: `The Friends Library App for iPhone and Android is now available!`,
            year: `2020`,
          },
        ]}
      />
    </div>
  ))
  .add(`NewsFeed (two years)`, () => (
    <div className="p-8 bg-black">
      <NewsFeed items={TWO_YEARS_ITEMS} />
    </div>
  ))
  .add(`NewsFeedBlock`, () => (
    <NewsFeedBlock
      bgImg={{ aspectRatio: 1, src: Books11, srcSet: `` }}
      items={TWO_YEARS_ITEMS}
    />
  ));

const TWO_YEARS_ITEMS = [
  {
    type: `book` as const,
    url: `/`,
    month: `Aug`,
    day: `10`,
    title: `The Journal of Jane Johnson`,
    description: `The Journal of Jane Johnson now available to download or purchase.`,
    year: `2020`,
  },
  {
    type: `audiobook` as const,
    url: `/`,
    month: `Jul`,
    day: `8`,
    title: `The Writings of Ambrose Rigge`,
    description: `The Writings of Ambrose Rigge now available in listening format.`,
    year: `2020`,
  },
  {
    type: `chapter` as const,
    url: `/`,
    month: `Jun`,
    day: `15`,
    title: `The Journal of Ann Branson &mdash; Chapter II (Spanish)`,
    description: `The Journal of Ann Banson Chapter II now available in Spanish.`,
    year: `2020`,
  },
  {
    type: `spanish_translation` as const,
    url: `/`,
    month: `May`,
    day: `7`,
    title: `The Goblet of Fire &mdash; Spanish Translation`,
    description: `Spanish translation now available on the Spanish Friends site!`,
    year: `2020`,
  },
  {
    type: `feature` as const,
    url: `/`,
    month: `Apr`,
    day: `2`,
    title: `Friends Library App`,
    description: `The Friends Library App for iPhone and Android is now available!`,
    year: `2020`,
  },
  {
    type: `book` as const,
    url: `/`,
    month: `Aug`,
    day: `10`,
    title: `The Journal of Jane Johnson`,
    description: `The Journal of Jane Johnson now available to download or purchase.`,
    year: `2019`,
  },
  {
    type: `audiobook` as const,
    url: `/`,
    month: `Jul`,
    day: `8`,
    title: `The Writings of Ambrose Rigge`,
    description: `The Writings of Ambrose Rigge now available in listening format.`,
    year: `2019`,
  },
];
