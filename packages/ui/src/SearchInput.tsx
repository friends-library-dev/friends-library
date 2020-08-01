import React from 'react';
import cx from 'classnames';
import Search from './icons/Search';

interface Props {
  query: string;
  setQuery: (query: string) => any;
  small?: boolean;
  open?: boolean;
  textColor?: string;
  lineColor?: 'flgray-400' | 'flprimary';
}

const SearchInput: React.FC<Props> = ({
  query,
  setQuery,
  small = false,
  open = true,
  lineColor = `flgray-400`,
  textColor = `flgray-500`,
}) => {
  // purgeCSS: h-12 w-12 h-10 w-10 text-flgray-500
  const size = small ? 10 : 12;
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`rounded-full bg-white relative h-${size}`}
    >
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className={cx(
          `SearchInput__input`,
          // purgeCSS: border-flgray-400 border-flprimary
          `border border-${lineColor} rounded-full subtle-focus`,
          `h-${size} pl-4`,
          `antialiased font-sans`,
          {
            [`w-64 pr-16 text-${textColor}`]: open,
            [`w-${size} text-white`]: !open,
          },
        )}
      />
      <div
        className={`rounded-full border-l border-${lineColor} border-0 h-${size} w-${size} absolute top-0 right-0 flex justify-center items-center`}
      >
        <Search tailwindColor={lineColor} />
      </div>
    </form>
  );
};

export default SearchInput;
