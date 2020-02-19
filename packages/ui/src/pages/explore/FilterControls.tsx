import React from 'react';
import cx from 'classnames';
import SearchInput from './SearchInput';
import FilterSelect from './FilterSelect';

interface Props {
  activeFilters: string[];
  setActiveFilters: (selected: string[]) => any;
}

const FilterControls: React.FC<Props> = ({ activeFilters, setActiveFilters }) => (
  <div className="bg-flgray-100 p-8 flex justify-center items-center">
    <Label>Filter</Label>
    <FilterSelect selected={activeFilters} setSelected={setActiveFilters} />
    <Label className="ml-10">Search</Label>
    <SearchInput onSubmit={() => {}} />
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
