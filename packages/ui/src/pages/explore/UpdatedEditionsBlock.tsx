import React from 'react';
import Link from 'gatsby-link';
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
    <p className="body-text pb-12 max-w-screen-md leading-loose">
      We currently have <b>{books.length}</b> books available in an{' '}
      <em>updated edition</em>, with more being added regularly. For more information
      about our editions,{' '}
      <Link to="/editions" className="subtle-link">
        see here
      </Link>
      .
    </p>
    <BookSlider books={books} />
  </BgWordBlock>
);

export default UpdatedEditionsBlock;
