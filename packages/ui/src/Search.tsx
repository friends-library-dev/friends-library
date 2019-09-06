import React, { useEffect, useRef } from 'react';
import cx from 'classnames';
import { t } from './translation';
import styled from './styled';

const size = 40;

const Search = styled('div')<{ expanded: boolean }>`
  height: ${size}px;
  width: ${p => (p.expanded ? 6 * size : size)}px;
  border-radius: ${size / 2}px;
  border: 1px solid ${p => p.theme.primary.rgba(0.5)};
  position: relative;
  transition: width 0.25s ease-out;
  background: ${p => (p.expanded ? p.theme.primary.rgba(0.05) : 'none')};
  cursor: pointer;

  input {
    display: ${p => (p.expanded ? 'block' : 'none')};
    position: absolute;
    left: ${size / 2}px;
    top: 0;
    height: ${size - 2}px;
    border-width: 0;
    width: calc(100% - ${size * 1.0}px - 4%);
    font-size: 18px;
    font-weight: 200;
    letter-spacing: 2px;
    color: #333;
    line-height: 30px;
    padding-right: 4%;
    background: transparent;
  }

  input::placeholder {
    opacity: 0.5;
  }

  input:focus {
    outline-width: 0;
  }

  .mg {
    position: absolute;
    border-radius: 50%;
    top: 1.5%;
    right: 0;
    height: ${size}px;
    width: ${size}px;
  }

  .glass {
    position: absolute;
    top: 23%;
    left: 23%;
    width: 34%;
    height: 34%;
    border-radius: 50%;
    border: 3px solid ${p => p.theme.primary.hex};
  }

  .handle {
    position: absolute;
    width: 27%;
    height: 3px;
    background: ${p => p.theme.primary.hex};
    transform: rotate(39deg);
    border-radius: 2px;
    top: 55%;
    left: 48%;
  }
`;

interface Props {
  expanded: boolean;
  value?: string;
  onClick: () => void;
  onBlur: () => void;
  className?: string;
}

const Component: React.FC<Props> = ({ expanded, onClick, onBlur, value, className }) => {
  const input = useRef<HTMLInputElement>(null);
  useEffect(() => {
    if (input && input.current) {
      input.current.focus();
    }
  });

  return (
    <Search
      onBlur={onBlur}
      expanded={expanded}
      className={cx('Search', className)}
      onClick={onClick}
    >
      <div className="mg">
        <div className="glass" />
        <div className="handle" />
      </div>
      <input
        ref={input}
        type="text"
        placeholder={t`Search`}
        spellCheck={false}
        value={value}
      />
    </Search>
  );
};

export default Component;
