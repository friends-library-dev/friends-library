import React from 'react';
import Link from 'gatsby-link';
import { Front } from '@friends-library/cover-component';
import { Book } from './types';

const SearchResult: React.FC<Book> = props => (
  <Link to={props.documentUrl}>
    <Front {...props} className="mx-1" scaler={1 / 3} scope="1-3" size="m" />
  </Link>
);

export default SearchResult;
