import React, { useState } from 'react';
import cx from 'classnames';
import FilterSelectDropdown from './FilterSelectDropdown';

interface Props {
  selected: string[];
  setSelected: (selected: string[]) => any;
}

const FilterSelect: React.FC<Props> = ({ selected, setSelected }) => {
  const [pickerVisible, setPickerVisible] = useState<boolean>(false);
  return (
    <div className="rounded-full bg-white relative h-12 cursor-pointer">
      <div
        onClick={() => setPickerVisible(!pickerVisible)}
        className={cx(
          'border border-flgray-400 rounded-full subtle-focus',
          'h-12 w-64 pt-3 text-center select-none',
          'text-flgray-500 antialiased font-sans tracking-widest',
        )}
      >
        All Books
      </div>
      <div className="h-12 w-12 absolute top-0 right-0 flex justify-center items-center">
        <i className={`fa fa-chevron-${pickerVisible ? 'up' : 'down'} text-flgray-400`} />
      </div>
      {pickerVisible && (
        <FilterSelectDropdown selected={selected} setSelected={setSelected} />
      )}
    </div>
  );
};

export default FilterSelect;
