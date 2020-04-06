import React from 'react';
import cx from 'classnames';
import { LANG } from './env';
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
          width={LANG === 'en' ? 280 : idx === 1 ? 320 : 260}
          bg={null}
          className={cx(
            // purgeCSS: bg-flmaroon-600 bg-flmaroon-500 bg-flmaroon-400
            // purgeCSS: bg-flgold-600 bg-flgold-500 bg-flgold-400
            `bg-fl${LANG === 'en' ? 'maroon' : 'gold'}-${[600, 500, 400][idx]}`,
            // purgeCSS: z-30 z-20 z-10
            `z-${[30, 20, 10][idx]}`,
            {
              'mb-2': idx < buttons.length - 1,
              // purgeCSS: sm:-ml-12 md:-ml-12
              [`${brk}:-ml-12`]: idx > 0,
              // purgeCSS: sm:pl-6 md:pl-6
              [`${brk}:pl-6`]: idx > 0,
            },
          )}
        >
          {button.icon && <i className={`fa fa-${button.icon} pr-3`} />}
          {button.text}
        </Button>
      ))}
    </div>
  );
};

export default MultiPill;
