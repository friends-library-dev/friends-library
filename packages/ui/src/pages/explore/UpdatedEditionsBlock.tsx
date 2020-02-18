import React from 'react';
import { Book } from './types';
import BgWordBlock from './BgWordBlock';
import BookSlider from './BookSlider';
import './UpdatedEditionsBlock.css';

interface Props {
  books: Book[];
}

const UpdatedEditionsBlock: React.FC<Props> = ({ books }) => (
  <BgWordBlock
    className="UpdatedEditionsBlock p-10 flex flex-col items-center md:py-16"
    word="Updated"
    title="Updated Editions"
  >
    <p className="body-text pb-12">
      We have over {books.length} books to purchase or download. Here, you can view them
      all.
    </p>
    <BookSlider books={books} />
  </BgWordBlock>
);

export default UpdatedEditionsBlock;
