import React from 'react';
import cx from 'classnames';
import { t } from '../../translation';
import SearchInput from '../../SearchInput';
import FilterSelect from './FilterSelect';

interface Props {
  activeFilters: string[];
  setActiveFilters: (selected: string[]) => any;
  searchQuery: string;
  setSearchQuery: (query: string) => any;
}

const FilterControls: React.FC<Props> = ({
  activeFilters,
  setActiveFilters,
  searchQuery,
  setSearchQuery,
}) => (
  <div className="bg-flgray-100 p-6 pb-12 md:p-8 flex flex-col md:flex-row justify-center items-center">
    <Label>{t`Filters`}</Label>
    <FilterSelect selected={activeFilters} setSelected={setActiveFilters} />
    <Label className="mt-4 md:mt-0 md:ml-10">{t`Search`}</Label>
    <SearchInput query={searchQuery} setQuery={setSearchQuery} />
  </div>
);

export default FilterControls;

const Label: React.FC<{ className?: string }> = ({ children, className }) => (
  <div
    className={cx(
      className,
      'h-12 flex flex-col justify-center mr-4',
      'uppercase font-sans text-flgray-500 tracking-wide text-base',
    )}
  >
    {children}
  </div>
);
