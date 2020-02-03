import React from 'react';
import cx from 'classnames';
import Button from './Button';
import './MultiPill.css';

interface Props {
  className?: string;
  inline?: boolean;
  buttons: {
    text: string;
    icon?: string;
    onClick?: () => any;
  }[];
}
const MultiPill: React.FC<Props> = ({ buttons, className, inline = false }) => {
  const brk = inline ? 'sm' : 'md';
  return (
    <div className={cx(className, 'MultiPill', `${brk}:flex`, { inline })}>
      {buttons.map((button, idx) => (
        <Button
          key={button.text}
          {...(button.onClick ? { onClick: button.onClick } : {})}
          bg={null}
          className={cx(`bg-flmaroon-${[600, 500, 400][idx]}`, `z-${[30, 20, 10][idx]}`, {
            'mb-2': idx < buttons.length - 1,
            [`${brk}:-ml-12`]: idx > 0,
            [`${brk}:pl-6`]: idx > 0,
          })}
        >
          {button.icon && <i className={`fa fa-${button.icon} pr-3`} />}
          {button.text}
        </Button>
      ))}
    </div>
  );
};

export default MultiPill;
