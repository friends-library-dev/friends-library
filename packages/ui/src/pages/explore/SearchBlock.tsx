import React, { useState } from 'react';
import { Book, Region } from './types';
import SearchControls from './SearchControls';
import SearchResult from './SearchResult';

interface Props {
  books: (Book & {
    tags: string[];
    period: 'early' | 'mid' | 'late';
    region: Region;
  })[];
}

const SearchBlock: React.FC<Props> = ({ books }) => {
  const [filters, setFilters] = useState<string[]>(['edition.updated']);
  const [query, setQuery] = useState<string>('');
  const matches = match(books, filters, query.toLowerCase().trim());
  return (
    <div className="">
      <SearchControls
        books={books}
        filters={filters}
        setFilters={setFilters}
        searchQuery={query}
        setSearchQuery={setQuery}
      />
      {matches.length > 0 && (
        <div className="flex flex-wrap justify-center my-8">
          {matches.map(book => (
            <SearchResult {...book} />
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBlock;

function match(books: Props['books'], filters: string[], search: string): Props['books'] {
  if (!filters.length && search.length < 2) {
    return [];
  }

  return books.filter(book => {
    if (search && search.length > 1) {
      if (
        !book.title.toLowerCase().includes(search) &&
        !book.author.toLowerCase().includes(search)
      ) {
        return false;
      }
    }

    for (let filter of filters) {
      const [type, value] = filter.split('.');
      if (type === 'edition' && book.edition !== value) {
        return false;
      }
      if (type === 'period' && book.period !== value) {
        return false;
      }
      if (type === 'region' && book.region !== value) {
        return false;
      }
      if (type === 'tag' && !book.tags.includes(value)) {
        return false;
      }
    }
    return true;
  });
}
