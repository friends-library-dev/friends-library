import React from 'react';
import cx from 'classnames';
import { connectPagination } from 'react-instantsearch-dom';
import { t } from '@friends-library/locale';

interface Props {
  currentRefinement: number;
  nbPages: number;
  refine: (page: number) => any;
  createURL: (page: number) => any;
}

const Pagination: React.FC<Props> = ({
  currentRefinement,
  createURL,
  nbPages,
  refine,
}) => {
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
          <li key={`page-${page}`}>
            <a
              className={cx(
                `flex items-center justify-center`,
                `w-5 h-5 rounded-md ml-1`,
                `text-xs cursor-pointer subtle-focus`,
                isActive && `bg-flprimary-400 text-white`,
                !isActive && `bg-flgray-400 text-flgray-500`,
              )}
              href={createURL(page)}
              onClick={(e) => {
                e.preventDefault();
                refine(page);
              }}
            >
              {page}
            </a>
          </li>
        );
      })}
    </ul>
  );
};

export default connectPagination(Pagination);
