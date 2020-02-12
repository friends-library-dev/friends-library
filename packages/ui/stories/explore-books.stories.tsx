import React, { useState } from 'react';
import { storiesOf } from '@storybook/react';
import { action as a } from '@storybook/addon-actions';
import ActiveFilters from '../src/pages/explore/ActiveFilters';
import TimePicker from '../src/pages/explore/TimePicker';
import FilterSelectDropdown from '../src/pages/explore/FilterSelectDropdown';
import FilterControls from '../src/pages/explore/FilterControls';
import NavBlock from '../src/pages/explore/NavBlock';

storiesOf('Explore Books Page', module)
  .add('TimePicker', () => {
    const [date, setDate] = useState<number>(1650);
    return (
      <div className="bg-gray-600 p-16 h-screen">
        <TimePicker selected={date} setSelected={setDate} />
      </div>
    );
  })
  .add('NavBlock', () => <NavBlock />)
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
  .add('FilterSelectDropdown', () => {
    const [selected, setSelected] = useState<string[]>(['edition.updated']);
    return (
      <div className="bg-flblue-400 h-screen p-12 flex justify-center items-start">
        <FilterSelectDropdown selected={selected} setSelected={setSelected} />
      </div>
    );
  });
