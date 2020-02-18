import React, { useState } from 'react';
import { Book, Region } from './types';
import BgWordBlock from './BgWordBlock';
import MapSlider from './MapSlider';
import BookSlider from './BookSlider';

interface Props {
  books: (Book & { region: Region })[];
}

const RegionBlock: React.FC<Props> = ({ books }) => {
  const [region, setRegion] = useState<Region>('England');
  return (
    <BgWordBlock word="Geography" className="p-10" title="Geography">
      <p className="body-text pb-12">
        Browse books by geography. Start by clicking one of the map icons below.
      </p>
      <MapSlider className="-mx-10" region={region} setRegion={setRegion} />
      <div className="-mt-12 flex flex-col items-center">
        <BookSlider books={books.filter(book => book.region === region)} />
      </div>
    </BgWordBlock>
  );
};

export default RegionBlock;
