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
import MapSlider from '../src/pages/explore/MapSlider';
import BookTeaserCard from '../src/BookTeaserCard';
import { coverSizes } from './decorators';
import { props as coverProps } from './cover.stories';

storiesOf('Explore Books Page', module)
  .addDecorator(coverSizes)
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
  .add('MapSlider', () => <MapSlider />)
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
    return <FilterControls activeFilters={selected} setActiveFilters={setSelected} />;
  })
  .add('ActiveFilters', () => (
    <ActiveFilters
      filters={[
        { text: 'Updated (112)', dismissable: true },
        { text: 'Original (24)', dismissable: true },
      ]}
      onClearAll={a('clear all')}
    />
  ))
  .add('BookTeaserCard', () => (
    <div className="bg-flblue py-16">
      <BookTeaserCard
        {...coverProps}
        description="This is the modern edition of this book title. This is an explanation of what the difference is between the updated, modern, and the real OG version..."
        documentUrl="/"
        authorUrl="/"
        badgeText="Feb 10"
      />
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
