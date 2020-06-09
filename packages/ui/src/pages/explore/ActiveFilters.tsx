import React from 'react';
import cx from 'classnames';
import Dual from '../../Dual';
import FilterBtn from './FilterBtn';
import './ActiveFilters.css';

interface Filter {
  text: string;
  clear: () => any;
}

interface Props {
  groups: {
    label: string;
    filters: Filter[];
  }[];
  clearAll: () => any;
}

const ActiveFilters: React.FC<Props> = ({ groups, clearAll }) => {
  return (
    <div className="bg-flgray-300 p-6 flex flex-col">
      <Dual.span className="text-flgray-500 font-sans tracking-wider uppercase text-center text-base antialiased mb-2">
        <>Active Filters:</>
        <>Filtros Activos:</>
      </Dual.span>
      <div className="flex flex-col md:flex-row md:flex-wrap">
        {groups.map(group => (
          <div
            className={cx(
              `ActiveFilters__Group bg-blue-200* my-1 mb-2`,
              `md:flex md:flex-wrap md:mx-2`,
            )}
            key={group.label}
          >
            <div className="flex items-center">
              <h5 className="sans-wider antialiased text-right text-flgray-500 mr-1 pr-2 md:pr-0 w-1/4 sm:w-1/5 md:w-auto">
                {group.label}:
              </h5>
              <div className="w-3/4 sm:w-4/5 md:flex md:w-auto">
                {group.filters.map(filter => (
                  <FilterBtn
                    className="m-1 capitalize"
                    key={filter.text}
                    onClick={filter.clear}
                    dismissable
                  >
                    {filter.text}
                  </FilterBtn>
                ))}
              </div>
            </div>
          </div>
        ))}
        <div className="hidden md:flex flex-grow xl:flex-grow-0 mt-2 ml-auto justify-center">
          <FilterBtn key="clear-all" onClick={clearAll}>
            <Dual.frag>
              <>Clear All Filters</>
              <>Borrar todos los Filtros</>
            </Dual.frag>
          </FilterBtn>
        </div>
      </div>
      <div className="mt-4 flex justify-center md:hidden">
        <FilterBtn key="clear-all" onClick={clearAll}>
          <Dual.frag>
            <>Clear All Filters</>
            <>Borrar todos los Filtros</>
          </Dual.frag>
        </FilterBtn>
      </div>
    </div>
  );
};

export default ActiveFilters;
