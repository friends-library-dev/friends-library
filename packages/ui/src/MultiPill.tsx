import React from 'react';
import cx from 'classnames';
import Button from './Button';
import './MultiPill.css';

interface Props {
  buttons: {
    text: string;
    icon?: string;
  }[];
}
const MultiPill: React.FC<Props> = ({ buttons }) => {
  return (
    <div className="MultiPill md:flex">
      {buttons.map((button, idx) => (
        <Button
          key={button.text}
          className={cx(`bg-flmaroon-${[600, 500, 400][idx]}`, `z-${[30, 20, 10][idx]}`, {
            'mb-2': idx < buttons.length - 1,
            'md:-ml-12': idx > 0,
            'md:pl-6': idx > 0,
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
