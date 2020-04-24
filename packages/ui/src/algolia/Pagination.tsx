import React from 'react';
import cx from 'classnames';
import { connectPagination } from 'react-instantsearch-dom';
import { t } from '@friends-library/locale';

interface Props {
  currentRefinement: number;
  nbPages: number;
  refine: (page: number) => any;
}

const Pagination: React.FC<Props> = ({ currentRefinement, nbPages, refine }) => {
  if (nbPages < 2) return null;
  return (
    <ul className="flex justify-center items-center mt-2">
      <li className="text-xs uppercase tracking-wider text-flgray-500 antialiased">
        {t`Page`}:
      </li>
      {Array.from({ length: Math.min(nbPages, 8) }).map((_, index) => {
        const page = index + 1;
        const isActive = currentRefinement === page;
        return (
          <li
            onClick={() => refine(page)}
            key={`page-${page}`}
            className={cx(
              'flex items-center justify-center',
              'w-5 h-5 rounded-md ml-1',
              'text-xs cursor-pointer',
              isActive && 'bg-flprimary-400 text-white',
              !isActive && 'bg-flgray-400 text-flgray-500',
            )}
          >
            <span>{page}</span>
          </li>
        );
      })}
    </ul>
  );
};

export default connectPagination(Pagination);
