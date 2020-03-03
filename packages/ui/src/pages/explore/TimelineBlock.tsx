import React, { useState } from 'react';
import { Book } from './types';
import BgWordBlock from './BgWordBlock';
import PillDropdown from './PillDropdown';
import PillDropdownItem from './PillDropdownItem';
import PillDropdownDropdown from './PillDropdownDropdown';
import BookSlider from './BookSlider';
import TimePicker from './TimePicker';
import { useWindowWidth } from '../../hooks/window-width';
import { SCREEN_MD } from '../../lib/constants';
import './TimelineBlock.css';

interface Props {
  books: (Book & { date: number })[];
}

const TimelineBlock: React.FC<Props> = ({ books }) => {
  const [date, setDate] = useState<number>(1650);
  const windowWidth = useWindowWidth();
  const nextDate = date + (windowWidth < SCREEN_MD ? 50 : 25);
  return (
    <div id="TimelineBlock" className="TimelineBlock">
      <BgWordBlock
        word="Timeline"
        className="TimelineBlock_Hero px-12 pt-40 pb-24 sm:pb-32"
      >
        <div className="bg-white px-10 py-12 text-center max-w-screen-md mx-auto">
          <h2 className="font-sans text-flblack tracking-wide text-3xl mb-6">Timeline</h2>
          <p className="body-text leading-loose">
            The books in our library were written over the course of approximately 200
            years. Use the timeline picker below to view books from the time period of
            your choice.
          </p>
        </div>
        <div className="sm:hidden">
          <label className="font-sans text-center text-white uppercase antialiased mt-12 mb-2 block tracking-widest">
            Pick a Date
          </label>
          <PillDropdown pillText={String(date)} className="mx-auto">
            <PillDropdownDropdown>
              <PillDropdownItem onClick={() => setDate(1650)} selected={date === 1650}>
                1650
              </PillDropdownItem>
              <PillDropdownItem onClick={() => setDate(1700)} selected={date === 1700}>
                1700
              </PillDropdownItem>
              <PillDropdownItem onClick={() => setDate(1750)} selected={date === 1750}>
                1750
              </PillDropdownItem>
              <PillDropdownItem onClick={() => setDate(1800)} selected={date === 1800}>
                1800
              </PillDropdownItem>
              <PillDropdownItem onClick={() => setDate(1850)} selected={date === 1850}>
                1850
              </PillDropdownItem>
            </PillDropdownDropdown>
          </PillDropdown>
        </div>
        <TimePicker
          className="hidden sm:flex mt-24 mx-8 max-w-screen-lg lg:mx-auto"
          selected={date}
          setSelected={setDate}
        />
      </BgWordBlock>
      <div className="bg-flgold text-center text-white text-2xl p-3 tracking-widest sm:hidden">
        {date}
      </div>
      <div className="flex flex-col md:flex-row md:justify-center items-center pt-12 sm:-mt-32 mb-8">
        <div
          className="hidden md:block bg-flgold text-white box-content h-48 py-2 px-2 mr-4 -mt-48 text-center text-xl transform rotate-180"
          style={{ writingMode: 'vertical-rl' }}
        >
          {date}
        </div>
        <BookSlider
          books={books
            .filter(b => b.date >= date && b.date <= nextDate)
            .sort((a, b) => (a.date < b.date ? -1 : 1))}
        />
      </div>
    </div>
  );
};

export default TimelineBlock;
