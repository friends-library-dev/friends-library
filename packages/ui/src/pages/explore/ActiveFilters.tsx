import React from 'react';
import FilterPill from './FilterPill';

interface Props {
  filters: {
    text: string;
    dismissable?: boolean;
  }[];
  onClearAll: () => any;
}

const ActiveFilters: React.FC<Props> = ({ filters, onClearAll }) => {
  return (
    <div className="bg-flgray-300 p-6 flex justify-center">
      <span className="text-flgray-500 font-sans tracking-wider text-base antialiased pr-4 pt-1">
        Active Filters:
      </span>
      {filters.map(filter => (
        <FilterPill key={filter.text} onClick={() => {}} dismissable={filter.dismissable}>
          {filter.text}
        </FilterPill>
      ))}
      <FilterPill key="clear-all" onClick={onClearAll}>
        Clear All
      </FilterPill>
    </div>
  );
};

export default ActiveFilters;
