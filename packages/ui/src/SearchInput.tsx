import React from 'react';
import cx from 'classnames';
import Search from './icons/Search';

interface Props {
  query: string;
  setQuery: (query: string) => any;
}

const SearchInput: React.FC<Props> = ({ query, setQuery }) => (
  <form
    onSubmit={e => e.preventDefault()}
    className="rounded-full bg-white relative h-12"
  >
    <input
      type="text"
      value={query}
      onChange={e => setQuery(e.target.value)}
      className={cx(
        'border border-flgray-400 rounded-full subtle-focus',
        'h-12 w-64 pl-4 pr-16',
        'text-flgray-500 antialiased font-sans',
      )}
    />
    <div className="rounded-full border-l border-flgray-400 border-0 h-12 w-12 absolute top-0 right-0 flex justify-center items-center">
      <Search tailwindColor="flgray-400" />
    </div>
  </form>
);

export default SearchInput;
