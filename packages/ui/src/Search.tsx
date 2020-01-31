import React, { useEffect, useRef, useState } from 'react';
import cx from 'classnames';
import { t } from './translation';
import './Search.css';

interface Props {
  expanded: boolean;
  initialValue?: string;
  onClick: () => any;
  onBlur: () => any;
  onSubmit?: (query: string) => any;
  className?: string;
  autoFocus?: boolean;
}

const Component: React.FC<Props> = ({
  expanded,
  onClick,
  onBlur,
  initialValue,
  className,
  autoFocus = false,
  onSubmit = searchGoogle,
}) => {
  const [value, setValue] = useState<string>(initialValue || '');
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (autoFocus && input && input.current) {
      input.current.focus();
    }
  });

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        onSubmit(value || '');
      }}
      onBlur={onBlur}
      className={cx(
        'Search border border-flprimary bg-transparent relative cursor-pointer',
        'transition-ease-out-1/4s rounded-full',
        className,
        expanded && 'expanded',
      )}
      onClick={onClick}
    >
      <div className="mg absolute rounded-full right-0">
        <div className="glass border-flprimary rounded-full absolute" />
        <div className="handle bg-flprimary absolute" />
      </div>
      {expanded && (
        <input
          className="absolute top-0 border-0 font-hairline bg-transparent tracking-widest text-gray-700"
          ref={input}
          type="text"
          placeholder={t`Search`}
          spellCheck={false}
          value={value}
          onChange={e => setValue(e.target.value)}
        />
      )}
    </form>
  );
};

export default Component;

function searchGoogle(query: string): void {
  if (!query) {
    return;
  }

  const domain = window.location.hostname;
  window.location.href = `https://google.com/search?sitesearch=${domain}&q=${query}`;
}
