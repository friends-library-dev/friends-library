import React from 'react';
import { Book } from './types';
import './UpdatedEditionsBlock.css';
import BookSlider from './BookSlider';

interface Props {
  books: Book[];
}

const UpdatedEditionsBlock: React.FC<Props> = ({ books }) => (
  <div
    className="UpdatedEditionsBlock text-center relative p-10 overflow-hidden font-sans flex flex-col items-center md:py-16"
    data-bgword="Updated"
  >
    <h2 className="text-flgray-900 text-3xl tracking-widest mb-8">Updated Editions</h2>
    <p className="body-text pb-12">
      We have over {books.length} books to purchase or download. Here, you can view them
      all.
    </p>
    <BookSlider books={books} />
  </div>
);

export default UpdatedEditionsBlock;
