import React from 'react';
import NewsFeedItem from './NewsFeedItem';
import './NewsFeedYear.css';

interface Props {
  year: string;
  items: Omit<React.ComponentProps<typeof NewsFeedItem>[], 'alt'>;
}

const NewsFeedYear: React.FC<Props> = ({ year, items }) => (
  <div className="NewsFeedYear sm:flex self-stretch">
    <div className="NewsFeedYear__Year bg-flprimary text-white text-center p-2 antialiased text-xl sans-widest">
      {year}
    </div>
    <div className="flex-grow">
      {items.map((item, idx) => (
        <NewsFeedItem {...item} alt={idx % 2 !== 0} />
      ))}
    </div>
  </div>
);

export default NewsFeedYear;
