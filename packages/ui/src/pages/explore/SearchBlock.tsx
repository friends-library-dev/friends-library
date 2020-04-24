import React, { useState, useEffect } from 'react';
import BackgroundImage from 'gatsby-background-image';
import { FluidBgImageObject } from '@friends-library/types';
import { t } from '@friends-library/locale';
import { Book, Region } from './types';
import { bgLayer } from '../../lib/color';
import SearchControls from './SearchControls';
import SearchResult from './SearchResult';

interface Props {
  initialFilters?: string[];
  initialUsed?: boolean;
  bgImg: FluidBgImageObject;
  books: (Book & {
    tags: string[];
    period: 'early' | 'mid' | 'late';
    region: Region;
  })[];
}

const SearchBlock: React.FC<Props> = ({ books, initialFilters, bgImg, initialUsed }) => {
  const [filters, setFilters] = useState<string[]>(initialFilters || []);
  const [used, setUsed] = useState<boolean>(initialUsed || false);
  const [query, setQuery] = useState<string>('');
  const matches = match(books, filters, query.toLowerCase().trim());

  useEffect(() => {
    if (!used && userHasInteractedWithSearch(query, filters, initialFilters)) {
      setUsed(true);
    }
  }, [filters, query, initialFilters, used]);

  return (
    <div id="SearchBlock">
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
            <SearchResult key={`${book.documentUrl}/${book.edition}`} {...book} />
          ))}
        </div>
      )}
      {matches.length === 0 && (
        <BackgroundImage
          style={{ minHeight: '45vh' }}
          fluid={[bgLayer([0, 0, 0], 0.3), bgImg]}
          className="SearchBlock__Results--empty bg-cover px-16 sm:px-32 flex flex-col justify-center bg-bottom"
        >
          <p className="text-white text-2xl sm:text-3xl sans-wider text-center">
            {used
              ? t`Your search returned no results`
              : `^ ${t`Select a filter or search to get started!`}`}
          </p>
        </BackgroundImage>
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

    for (const filter of filters) {
      const [type, value] = filter.split('.');
      if (type === 'edition' && book.edition !== value) {
        return false;
      }
      if (type === 'period' && book.period !== value) {
        return false;
      }
      if (type === 'region' && !regionMatches(value, book)) {
        return false;
      }
      if (type === 'tag' && !book.tags.includes(value)) {
        return false;
      }
    }
    return true;
  });
}

function regionMatches(region: string, book: Props['books'][0]): boolean {
  const compare = book.region.toLowerCase().replace(/ /g, '-');
  return region === compare;
}

function userHasInteractedWithSearch(
  query: string,
  filters: string[],
  initialFilters?: string[],
): boolean {
  return !!(
    query !== '' || JSON.stringify(filters) !== JSON.stringify(initialFilters || [])
  );
}
