import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import ActiveFilters from '../src/pages/explore/ActiveFilters';
import TimePicker from '../src/pages/explore/TimePicker';
import FilterSelectDropdown from '../src/pages/explore/FilterSelectDropdown';
import FilterControls from '../src/pages/explore/FilterControls';
import NavBlock from '../src/pages/explore/NavBlock';
import GettingStartedLinkBlock from '../src/pages/explore/GettingStartedLinkBlock';
import SearchResultBack from '../src/pages/explore/SearchResultBack';
import SpanishSiteBlock from '../src/pages/explore/SpanishSiteBlock';
import SelectableMap from '../src/pages/explore/SelectableMap';
import BookSlider from '../src/pages/explore/BookSlider';
import NewBooksBlock from '../src/pages/explore/NewBooksBlock';
import UpdatedEditionsBlock from '../src/pages/explore/UpdatedEditionsBlock';
import AudioBooksBlock from '../src/pages/explore/AudioBooksBlock';
import RegionBlock from '../src/pages/explore/RegionBlock';
import SearchBlock from '../src/pages/explore/SearchBlock';
import TimelineBlock from '../src/pages/explore/TimelineBlock';
import MapSlider from '../src/pages/explore/MapSlider';
import BookTeaserCard from '../src/BookTeaserCard';
import { Region, Book } from '../src/pages/explore/types';
import { coverSizes } from './decorators';
import { props as coverProps } from './cover.stories';

storiesOf('Explore Books Page/NewBooksBlock', module)
  .addDecorator(coverSizes)
  .add('one', () => <NewBooksBlock books={[book()]} />)
  .add('two', () => <NewBooksBlock books={[book(), book()]} />)
  .add('four', () => <NewBooksBlock books={[book(), book(), book(), book()]} />)
  .add('three', () => <NewBooksBlock books={[book(), book(), book()]} />);

storiesOf('Explore Books Page', module)
  .addDecorator(coverSizes)
  .add('UpdatedEditionsBlock', () => <UpdatedEditionsBlock books={pileOfBooks} />)
  .add('AudioBooksBlock', () => <AudioBooksBlock books={pileOfBooks} />)
  .add('SearchBlock', () => <SearchBlock books={pileOfBooks} />)
  .add('TimelineBlock', () => (
    <TimelineBlock
      books={[
        ...pileOfBooks,
        ...pileOfBooks.map(b => ({ ...b, documentUrl: `/2/${b.documentUrl}` })),
        ...pileOfBooks.map(b => ({ ...b, documentUrl: `/3/${b.documentUrl}` })),
      ]}
    />
  ))
  .add('RegionBlock', () => (
    <RegionBlock
      books={[
        ...pileOfBooks,
        ...pileOfBooks.map(b => ({ ...b, documentUrl: `/2/${b.documentUrl}` })),
        ...pileOfBooks.map(b => ({ ...b, documentUrl: `/3/${b.documentUrl}` })),
      ]}
    />
  ))
  .add('BookSlider', () => (
    <div className="p-6 md:p-12 flex justify-center">
      <BookSlider books={pileOfBooks} />
    </div>
  ))
  .add('TimePicker', () => {
    const [date, setDate] = useState<number>(1650);
    return (
      <div className="bg-gray-600 p-16 h-screen">
        <TimePicker selected={date} setSelected={setDate} />
      </div>
    );
  })
  .add('NavBlock', () => <NavBlock />)
  .add('SpanishSiteBlock', () => <SpanishSiteBlock numBooks={43} url="/" />)
  .add('GettingStartedLinkBlock', () => <GettingStartedLinkBlock />)
  .add('MapSlider', () => {
    const [region, setRegion] = useState<Region>('England');
    return <MapSlider region={region} setRegion={setRegion} />;
  })
  .add('SelectableMap', () => {
    const [region, selectRegion] = useState<string>('England');
    return <SelectableMap selectedRegion={region} selectRegion={selectRegion} />;
  })
  .add('SearchResultBack', () => (
    <div className="mx-auto my-12" style={{ width: 290 }}>
      <SearchResultBack
        description="We have over 200 books to purchase or download. Here, you can view them all. This is a description of this book. It shouldn't be too long. Just an excerpt."
        url="/"
        hasAudio
      />
    </div>
  ))
  .add('FilterControls', () => {
    const [selected, setSelected] = useState<string[]>(['edition.updated']);
    const [query, setQuery] = useState<string>('');
    return (
      <FilterControls
        activeFilters={selected}
        setActiveFilters={setSelected}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
    );
  })
  .add('ActiveFilters', () => {
    return (
      <ActiveFilters
        groups={[
          {
            label: 'Editions',
            filters: [
              { clear: a('clear'), text: 'Updated (33)' },
              { clear: a('clear'), text: 'Original (14)' },
              { clear: a('clear'), text: 'Modernized (53)' },
            ],
          },
          {
            label: 'Tags',
            filters: [{ clear: a('clear'), text: 'Journal (54)' }],
          },
          {
            label: 'Region',
            filters: [{ clear: a('clear'), text: 'Scotland (3)' }],
          },
        ]}
        clearAll={a('clear all')}
      />
    );
  })
  .add('BookTeaserCard', () => (
    <div className="bg-flblue py-16">
      <BookTeaserCard {...book()} />
    </div>
  ))
  .add('FilterSelectDropdown', () => {
    const [selected, setSelected] = useState<string[]>(['edition.updated']);
    return (
      <div className="bg-flblue-400 h-screen p-12 flex justify-center items-start">
        <FilterSelectDropdown selected={selected} setSelected={setSelected} />
      </div>
    );
  });

type KitchenSinkBook = Book & {
  region: Region;
  date: number;
  tags: string[];
  period: 'early' | 'mid' | 'late';
  badgeText: string;
  description: string;
};

function book(props: Partial<KitchenSinkBook> = {}): KitchenSinkBook {
  return {
    ...coverProps,
    description:
      'This is the modern edition of this book title. This is an explanation of what the difference is between the updated, modern, and the real OG version...',
    authorUrl: '/',
    documentUrl: '/',
    tags: ['journal', 'letters'],
    period: 'early',
    date: 1680,
    region: 'England',
    badgeText: 'Feb 10',
    ...props,
  };
}

const pileOfBooks = [
  book({
    region: 'England',
    author: 'Samuel Rundell',
    title: 'The Work of Vital Religion in the Soul',
    documentUrl: '/rundell',
    date: 1650,
  }),
  book({
    region: 'Ireland',
    author: 'Stephen Crisp',
    title: 'A Plain Pathway',
    documentUrl: '/crisp/path',
    date: 1650,
  }),
  book({
    region: 'Scotland',
    author: 'Charles Marshall',
    title: 'The Journal of Charles Marshall',
    documentUrl: '/marshall/journal',
    date: 1650,
  }),
  book({
    region: 'Northern US',
    author: 'George Fox',
    title: 'The Journal of George Fox',
    documentUrl: '/fox/journal',
    date: 1700,
  }),
  book({
    region: 'Scotland',
    author: 'William Penn',
    title: 'No Cross, No Crown',
    documentUrl: '/penn/no-cross',
    date: 1700,
  }),
  book({
    region: 'England',
    author: 'Hugh Turford',
    title: 'Walk in the Spirit',
    documentUrl: '/turford/walk',
    date: 1700,
  }),
  book({
    region: 'Southern US',
    author: 'Robert Barclay',
    title: 'Saved to the Uttermost',
    documentUrl: '/barclay/saved',
    date: 1850,
  }),
  book({
    region: 'Ireland',
    author: 'Robert Barclay',
    title: 'Waiting Upon the Lord',
    documentUrl: '/barclay/waiting',
    date: 1850,
  }),
  book({
    region: 'Southern US',
    author: 'Joseph Phipps',
    title: 'The Original and Present State of Man',
    documentUrl: '/phipps/state',
    date: 1850,
  }),
];
