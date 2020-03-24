import React from 'react';
import { t } from '../../translation';
import FilterSelectDropdown from './FilterSelectDropdown';
import PillDropdown from '../../PillDropdown';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterSelect: React.FC<Props> = ({ selected, setSelected }) => (
  <PillDropdown pillText={t`All Books`}>
    <FilterSelectDropdown selected={selected} setSelected={setSelected} />
  </PillDropdown>
);

export default FilterSelect;
