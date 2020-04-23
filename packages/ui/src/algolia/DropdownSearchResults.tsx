import React from 'react';
import cx from 'classnames';
import { connectStateResults, Index, Configure } from 'react-instantsearch-dom';
import Pagination from './Pagination';
import IndexResults from './IndexResults';
import { FriendHit, BookHit } from './SearchHits';
import { LANG } from '../env';
import { t } from '../translation';
import './DropdownSearchResults.css';

interface Props {
  className?: string;
  allSearchResults: Record<string, { nbHits: number }>;
  searchState: { query?: string; page: number };
}

const DropdownSearchResults: React.FC<Props> = ({
  className,
  allSearchResults: allResults,
  searchState: { query = '' },
}) => {
  const hasResults = allResults && Object.values(allResults).some(r => r && r.nbHits > 0);
  if (!hasResults && query.length < 3) {
    return (
      <div className={cx(query.length < 3 && 'hidden')}>
        <Index indexName={`${LANG}_docs`} />
        <Index indexName={`${LANG}_friends`} />
      </div>
    );
  }
  return (
    <div
      className={cx(
        className,
        'DropdownSearchResults border border-flgray-400 rounded-md bg-white',
        'absolute right-0 top-0 mt-16',
      )}
    >
      <div className="p-3">
        {!hasResults && (
          <p className="text-center px-2 py-3 text-gray-800 tracking-wide">
            {t`No results for query`}:{' '}
            <b className="antialiased">&ldquo;{query}&rdquo;</b>
          </p>
        )}
        <Configure hitsPerPage={3} />
        <Index indexName={`${LANG}_docs`}>
          <IndexResults title={t`Books`} icon="fa-book" HitComponent={BookHit} />
          <Pagination />
        </Index>
        <Index indexName={`${LANG}_friends`}>
          <IndexResults title={t`Friends`} icon="fa-users" HitComponent={FriendHit} />
          <Pagination />
        </Index>
      </div>
    </div>
  );
};

// @ts-ignore
export default connectStateResults(DropdownSearchResults) as React.FC<{
  className?: string;
}>;
