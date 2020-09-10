import React from 'react';
import cx from 'classnames';
import './Input.css';

interface Props {
  valid: boolean;
  placeholder: string;
  invalidMsg: string;
  className?: string;
  value?: string;
  onChange: (newVal: string) => void;
  onBlur?: () => void;
  onFocus?: () => void;
  autofocus?: boolean;
  type?: string;
  autoComplete?: string;
  name?: string;
}

const Input: React.FC<Props> = ({
  valid,
  autofocus,
  placeholder,
  invalidMsg,
  value,
  onChange,
  onBlur,
  onFocus,
  className,
  autoComplete,
  name,
  type = `text`,
}) => (
  <div className="relative">
    <input
      name={name}
      autoComplete={autoComplete}
      autoFocus={autofocus}
      className={cx(className, `CartInput`, { invalid: !valid })}
      type={type}
      placeholder={valid ? placeholder : invalidMsg}
      value={value || ``}
      onChange={(e) => onChange(e.target.value)}
      onBlur={onBlur || (() => {})}
      onFocus={onFocus || (() => {})}
    />
    {!valid && value && <InvalidOverlay>{invalidMsg}</InvalidOverlay>}
  </div>
);

export default Input;

export const InvalidOverlay: React.FC = ({ children }) => (
  <span className="absolute text-red-600 top-0 right-0 text-xs p-1 font-normal leading-tight">
    {children}
  </span>
);
