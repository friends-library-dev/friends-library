import React from 'react';
import FilterSelectDropdown from './FilterSelectDropdown';
import PillDropdown from '../../PillDropdown';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterSelect: React.FC<Props> = ({ selected, setSelected }) => (
  <PillDropdown pillText="All Books">
    <FilterSelectDropdown selected={selected} setSelected={setSelected} />
  </PillDropdown>
);

export default FilterSelect;
